import json
import os

from django.http import JsonResponse, HttpRequest, StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.db.models import Max
from django.shortcuts import get_object_or_404

from .prompts.interview import prompt as model_instruct
from .prompts.pre_consult import prompt as pre_consult_instruct
from .models import ChatSession, ChatMessage

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage


def _add_cors_headers(response: JsonResponse | StreamingHttpResponse) -> JsonResponse | StreamingHttpResponse:
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    return response


# set up LangChain components once (non-streaming and streaming use the same chain)
_api_key = os.environ.get("DEEPSEEK_API_KEY")

llm = ChatOpenAI(
    model="deepseek-v4-pro",
    api_key=_api_key,
    base_url="https://api.deepseek.com",
    temperature=0,
    reasoning_effort="high",)
        # "response_format": {"type": "json_object"} 
# llm = ChatOpenAI(
#     base_url="https://api.gapgpt.app/v1",
#     api_key="sk-maGdVnAynciq7MyrhlnX6NrVYcPirPgNR1y8N5CcxglcEVWG",
#     model="gpt-5.4",
#     temperature=0.9
# )

print(model_instruct)
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", model_instruct),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

chain = prompt | llm

prompt_pre_consult = ChatPromptTemplate.from_messages(
    [
        ("system", pre_consult_instruct),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)
chain_pre_consult = prompt_pre_consult | llm


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


def _chat_stream_response(request: HttpRequest, llm_chain, user_name_prefix: str = "") -> JsonResponse | StreamingHttpResponse:
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
    if not isinstance(message, str) or not message.strip():
        resp = JsonResponse({"error": "Field 'message' is required"}, status=400)
        return _add_cors_headers(resp)

    consultation_subject = data.get("consultation_subject")
    subject_labels = {
        "couples": "زوجین",
        "individual": "فردی",
        "pre_marriage": "پیش از ازدواج",
    }
    if isinstance(consultation_subject, str) and consultation_subject in subject_labels:
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
    print('/'*50)
    print(chat_history)
    print('/'*50)

    user_token_count = _offline_token_count(message)
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
    return _add_cors_headers(resp)


@csrf_exempt
def chat(request: HttpRequest):
    """
    POST /chat
    Body: { "message": "..." }
    Response: streamed text/plain chunks.
    """
    return _chat_stream_response(request, chain)


@csrf_exempt
def pre_consult_chat(request: HttpRequest):
    """
    POST /chat/pre-consult — پیش‌مشاوره (before first clinical visit).
    Same contract as /chat; separate session namespace via user_name prefix.
    """
    return _chat_stream_response(request, chain_pre_consult, user_name_prefix="pre_consult:")