import json
import os

from django.http import JsonResponse, HttpRequest, StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.db.models import Max
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .prompts.interview import prompt as model_instruct
from .prompts.pre_consult import (
    PRE_CONSULT_QUESTION_LIMIT,
    build_pre_consult_bootstrap_input,
    build_pre_consult_system_prompt,
    is_pre_consult_bootstrap_user_message,
    PRE_CONSULT_SUBJECT_LABELS,
)
from .models import ChatSession, ChatMessage
from .soniox_stt import ALLOWED_CONTENT_TYPES, SonioxSTTError, transcribe_audio_bytes

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage


def _add_cors_headers(response: JsonResponse | StreamingHttpResponse) -> JsonResponse | StreamingHttpResponse:
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    return response


def _json_cors(payload: dict, status: int = 200) -> JsonResponse:
    return _add_cors_headers(JsonResponse(payload, status=status))


# set up LangChain components once (non-streaming and streaming use the same chain)
_api_key = os.environ.get("DEEPSEEK_API_KEY")

llm = ChatOpenAI(
    model="deepseek-v4-flash",
    api_key=_api_key,
    base_url="https://api.deepseek.com",
    temperature=0.7,
    top_p = 0.9,
        reasoning_effort="high",)
        # "response_format": {"type": "json_object"} 

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", model_instruct),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)


chain = prompt | llm

def _count_assistant_messages(session_id: int) -> int:
    return ChatMessage.objects.filter(
        session_id=session_id,
        role=ChatMessage.ROLE_ASSISTANT,
    ).count()


def _pre_consult_phase_meta(assistant_count: int) -> dict:
    return {
        "questions_asked": assistant_count,
        "question_limit": PRE_CONSULT_QUESTION_LIMIT,
        "phase": "handoff" if assistant_count >= PRE_CONSULT_QUESTION_LIMIT else "questions",
    }


def _build_pre_consult_chain(assistant_count: int):
    system_prompt = build_pre_consult_system_prompt(assistant_count)
    prompt_template = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    return prompt_template | llm


def _offline_token_count(text: str) -> int:
    stripped = (text or "").strip()
    return max(1, len(stripped) // 4) if stripped else 0


def _build_langchain_history(session_id: int) -> list[BaseMessage]:
    history: list[BaseMessage] = []
    messages = ChatMessage.objects.filter(session_id=session_id).order_by("seq")
    for msg in messages:
        if msg.role == ChatMessage.ROLE_USER:
            history.append(HumanMessage(content=msg.content))
        elif msg.role == ChatMessage.ROLE_ASSISTANT:
            history.append(AIMessage(content=msg.content))
    return history


def _next_seq(session_id: int) -> int:
    max_seq = (
        ChatMessage.objects.filter(session_id=session_id).aggregate(max_seq=Max("seq"))["max_seq"]
        or 0
    )
    return max_seq + 1


def _persist_assistant_message(session: ChatSession, full_reply: str) -> None:
    assistant_token_count = _offline_token_count(full_reply)
    with transaction.atomic():
        assistant_seq = _next_seq(session.id)
        ChatMessage.objects.create(
            session=session,
            seq=assistant_seq,
            role=ChatMessage.ROLE_ASSISTANT,
            content=full_reply,
            token_count=assistant_token_count,
        )
        session.total_tokens += assistant_token_count
        session.save(update_fields=["total_tokens"])


def _chat_stream_response(
    request: HttpRequest,
    llm_chain=None,
    user_name_prefix: str = "",
    *,
    is_pre_consult: bool = False,
) -> JsonResponse | StreamingHttpResponse:
    """
    Shared POST handler: validate body, attach session, stream assistant tokens.
    user_name_prefix keeps pre-consult sessions separate from the main /chat flow.
    """
    # Handle CORS preflight
    if request.method == "OPTIONS":
        resp = JsonResponse({}, status=200)
        return _add_cors_headers(resp)

    if request.method != "POST":
        resp = JsonResponse({"error": "Only POST is allowed"}, status=405)
        return _add_cors_headers(resp)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        resp = JsonResponse({"error": "Invalid JSON body"}, status=400)
        return _add_cors_headers(resp)

    message = data.get("message")
    bootstrap_first_question = bool(data.get("bootstrap_first_question"))
    consultation_subject = data.get("consultation_subject")

    if bootstrap_first_question and is_pre_consult:
        if not isinstance(consultation_subject, str) or consultation_subject not in PRE_CONSULT_SUBJECT_LABELS:
            resp = JsonResponse(
                {"error": "Field 'consultation_subject' is required for bootstrap_first_question"},
                status=400,
            )
            return _add_cors_headers(resp)
        message = build_pre_consult_bootstrap_input(consultation_subject)
    elif not isinstance(message, str) or not message.strip():
        resp = JsonResponse({"error": "Field 'message' is required"}, status=400)
        return _add_cors_headers(resp)

    subject_labels = PRE_CONSULT_SUBJECT_LABELS
    if (
        isinstance(consultation_subject, str)
        and consultation_subject in subject_labels
        and not bootstrap_first_question
    ):
        label = subject_labels[consultation_subject]
        message = f"[موضوع پیش‌مشاوره: {label}]\n\n{message.strip()}"

    session_id = data.get("session_id")
    user_name = data.get("user_name") or "anonymous"
    if user_name_prefix:
        user_name = f"{user_name_prefix}{user_name}"
    initial_mood = data.get("initial_mood")
    new_session = bool(data.get("new_session"))

    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        resp = JsonResponse(
            {"error": "DEEPSEEK_API_KEY is not set on the server"},
            status=500,
        )
        return _add_cors_headers(resp)

    # Session create/get + persist user message
    if session_id is not None and not new_session:
        session = get_object_or_404(ChatSession, id=session_id)
    elif new_session:
        session = ChatSession.objects.create(
            user_name=user_name,
            initial_mood = initial_mood if isinstance(initial_mood, str) else None,
            consultation_subject=(
                consultation_subject
                if isinstance(consultation_subject, str) and consultation_subject in subject_labels
                else None
            ),
            total_tokens=0,
        )
    else:
        session = ChatSession.objects.filter(user_name=user_name).order_by("-started_at").first()
        if not session:
            session = ChatSession.objects.create(
                user_name=user_name,
                initial_mood=initial_mood if isinstance(initial_mood, str) else None,
                total_tokens=0,
            )

    chat_history = _build_langchain_history(session.id)

    assistant_count = _count_assistant_messages(session.id)
    phase_meta = _pre_consult_phase_meta(assistant_count) if is_pre_consult else None

    if is_pre_consult:
        update_fields: list[str] = []
        if (
            isinstance(consultation_subject, str)
            and consultation_subject in subject_labels
            and session.consultation_subject != consultation_subject
        ):
            session.consultation_subject = consultation_subject
            update_fields.append("consultation_subject")
        if assistant_count >= PRE_CONSULT_QUESTION_LIMIT and session.pre_consult_completed_at is None:
            session.pre_consult_completed_at = timezone.now()
            update_fields.append("pre_consult_completed_at")
        if update_fields:
            session.save(update_fields=update_fields)

        llm_chain = _build_pre_consult_chain(assistant_count)
    elif llm_chain is None:
        resp = JsonResponse({"error": "LLM chain is not configured"}, status=500)
        return _add_cors_headers(resp)

    user_token_count = _offline_token_count(message)
    if not bootstrap_first_question:
        user_seq = _next_seq(session.id)
        ChatMessage.objects.create(
            session=session,
            seq=user_seq,
            role=ChatMessage.ROLE_USER,
            content=message,
            token_count=user_token_count,
        )
        session.total_tokens += user_token_count
        session.save(update_fields=["total_tokens"])

    # Use a synchronous iterator for StreamingHttpResponse under runserver/WSGI.
    # Async iterators get consumed synchronously and can buffer whole responses.
    def stream_response():
        full_reply_parts: list[str] = []

        # stream tokens/chunks from the model
        for chunk in llm_chain.stream({"input": message, "chat_history": chat_history}):
            token = chunk.content or ""
            if not token:
                continue
            full_reply_parts.append(token)
            # send raw text chunks; frontend reads the stream and appends
            yield token

        # after streaming is done, persist assistant message
        full_reply = "".join(full_reply_parts)
        _persist_assistant_message(session, full_reply)

    resp = StreamingHttpResponse(stream_response(), content_type="text/plain; charset=utf-8")
    # Help proxies/dev servers avoid buffering streamed chunks.
    resp["Cache-Control"] = "no-cache"
    resp["X-Accel-Buffering"] = "no"
    resp["X-Session-Id"] = str(session.id)
    if phase_meta is not None:
        resp["X-Pre-Consult-Phase"] = phase_meta["phase"]
        resp["X-Pre-Consult-Questions-Asked"] = str(phase_meta["questions_asked"])
        resp["X-Pre-Consult-Question-Limit"] = str(phase_meta["question_limit"])
    return _add_cors_headers(resp)


@csrf_exempt
def chat(request: HttpRequest):
    """
    POST /chat
    Body: { "message": "..." }
    Response: streamed text/plain chunks.
    """
    return _chat_stream_response(request, chain)


def _chat_history_response(request: HttpRequest, user_name_prefix: str = "") -> JsonResponse:
    if request.method == "OPTIONS":
        resp = JsonResponse({}, status=200)
        return _add_cors_headers(resp)

    if request.method != "GET":
        resp = JsonResponse({"error": "Only GET is allowed"}, status=405)
        return _add_cors_headers(resp)

    user_name = request.GET.get("user_name") or "anonymous"
    if user_name_prefix:
        user_name = f"{user_name_prefix}{user_name}"

    session_id = request.GET.get("session_id")
    session = None

    if session_id:
        try:
            sid = int(session_id)
            session = ChatSession.objects.filter(id=sid, user_name=user_name).first()
        except (TypeError, ValueError):
            session = None
        if not session:
            resp = JsonResponse({"session_id": None, "messages": []})
            return _add_cors_headers(resp)
    else:
        session = ChatSession.objects.filter(user_name=user_name).order_by("-started_at").first()
        if not session:
            resp = JsonResponse({"session_id": None, "messages": []})
            return _add_cors_headers(resp)

    messages = ChatMessage.objects.filter(session_id=session.id).order_by("seq")
    assistant_count = _count_assistant_messages(session.id)
    if user_name_prefix == "pre_consult:":
        messages = [
            msg
            for msg in messages
            if not (
                msg.role == ChatMessage.ROLE_USER
                and is_pre_consult_bootstrap_user_message(msg.content)
            )
        ]
    payload = {
        "session_id": session.id,
        "messages": [
            {
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at.isoformat(),
            }
            for msg in messages
        ],
    }
    if user_name_prefix == "pre_consult:":
        payload["pre_consult"] = _pre_consult_phase_meta(assistant_count)
        payload["pre_consult"]["consultation_subject"] = session.consultation_subject
        payload["pre_consult"]["completed_at"] = (
            session.pre_consult_completed_at.isoformat()
            if session.pre_consult_completed_at
            else None
        )
    resp = JsonResponse(payload)
    return _add_cors_headers(resp)


@csrf_exempt
def chat_history(request: HttpRequest):
    """GET /chat/history — returns persisted messages for the latest or given session."""
    return _chat_history_response(request)


@csrf_exempt
def pre_consult_chat(request: HttpRequest):
    """
    POST /chat/pre-consult — پیش‌مشاوره (before first clinical visit).
    Same contract as /chat; separate session namespace via user_name prefix.
    """
    return _chat_stream_response(request, user_name_prefix="pre_consult:", is_pre_consult=True)


@csrf_exempt
def pre_consult_chat_history(request: HttpRequest):
    """GET /chat/pre-consult/history — pre-consult session history."""
    return _chat_history_response(request, user_name_prefix="pre_consult:")


@csrf_exempt
def pre_consult_session_detail(request: HttpRequest, session_id: int):
    """GET /chat/pre-consult/session/<id> — full transcript for doctor dashboard."""
    if request.method == "OPTIONS":
        resp = JsonResponse({}, status=200)
        return _add_cors_headers(resp)

    if request.method != "GET":
        resp = JsonResponse({"error": "Only GET is allowed"}, status=405)
        return _add_cors_headers(resp)

    session = get_object_or_404(ChatSession, id=session_id)
    if not session.user_name.startswith("pre_consult:"):
        resp = JsonResponse({"error": "Not a pre-consult session"}, status=404)
        return _add_cors_headers(resp)

    messages = ChatMessage.objects.filter(session_id=session.id).order_by("seq")
    assistant_count = _count_assistant_messages(session.id)
    visible_messages = [
        msg
        for msg in messages
        if not (
            msg.role == ChatMessage.ROLE_USER
            and is_pre_consult_bootstrap_user_message(msg.content)
        )
    ]
    payload = {
        "session_id": session.id,
        "consultation_subject": session.consultation_subject,
        "started_at": session.started_at.isoformat(),
        "completed_at": (
            session.pre_consult_completed_at.isoformat()
            if session.pre_consult_completed_at
            else None
        ),
        "pre_consult": _pre_consult_phase_meta(assistant_count),
        "messages": [
            {
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at.isoformat(),
            }
            for msg in visible_messages
        ],
    }
    resp = JsonResponse(payload)
    return _add_cors_headers(resp)


@csrf_exempt
def stt_transcribe(request: HttpRequest):
    """
    POST /stt/transcribe — upload audio; returns Persian transcript via Soniox.

    Multipart field: ``audio`` (webm, mp3, wav, m4a, …)
    Optional form field: ``language`` (default ``fa``)
    """
    if request.method == "OPTIONS":
        return _json_cors({})

    if request.method != "POST":
        return _json_cors({"error": "Only POST is allowed"}, status=405)

    upload = request.FILES.get("audio")
    if upload is None:
        return _json_cors({"error": "Missing multipart field 'audio'"}, status=400)

    content_type = (upload.content_type or "").split(";")[0].strip().lower()
    if content_type and content_type not in ALLOWED_CONTENT_TYPES:
        return _json_cors(
            {"error": f"Unsupported audio type: {content_type or 'unknown'}"},
            status=400,
        )

    language = (request.POST.get("language") or "fa").strip() or "fa"
    audio_bytes = upload.read()

    try:
        result = transcribe_audio_bytes(
            audio_bytes,
            filename=upload.name or "recording.webm",
            language=language,
        )
    except SonioxSTTError as exc:
        return _json_cors({"error": str(exc)}, status=502)

    return _json_cors(result)
