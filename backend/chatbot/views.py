import json
import os

from django.http import JsonResponse, HttpRequest, StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.db.models import Max
from django.shortcuts import get_object_or_404
from asgiref.sync import sync_to_async

from .prompts.interview import prompt as model_instruct
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
    model="deepseek-chat",
    api_key=_api_key,
    base_url="https://api.deepseek.com",
    temperature=0.7,
    streaming=True,
)

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", model_instruct),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

chain = prompt | llm


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

@csrf_exempt
def chat(request: HttpRequest):
    """
    Simple JSON API:
    POST /chat
    Body: { "message": "user prompt" }
    Response: { "reply": "model answer" }
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

    session_id = data.get("session_id")
    user_name = data.get("user_name") or "anonymous"
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

    # async streaming generator: avoids ASGI warning/slow wrapping.
    async def stream_response():
        full_reply_parts: list[str] = []

        # stream tokens/chunks from the model
        async for chunk in chain.astream({"input": message, "chat_history": chat_history}):
            token = chunk.content or ""
            if not token:
                continue
            full_reply_parts.append(token)
            # send raw text chunks; frontend reads the stream and appends
            yield token

        # after streaming is done, persist assistant message
        full_reply = "".join(full_reply_parts)
        await sync_to_async(_persist_assistant_message)(session, full_reply)

    resp = StreamingHttpResponse(stream_response(), content_type="text/plain; charset=utf-8")
    # Help proxies/dev servers avoid buffering streamed chunks.
    resp["Cache-Control"] = "no-cache"
    resp["X-Accel-Buffering"] = "no"
    resp["X-Session-Id"] = str(session.id)
    return _add_cors_headers(resp)