import json
import os

from django.http import JsonResponse, HttpRequest, StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt

from .prompts.interview import prompt as model_instruct

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage


def _add_cors_headers(response: JsonResponse | StreamingHttpResponse) -> JsonResponse | StreamingHttpResponse:
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    return response


# single in-memory history for the chatbot
history: list[BaseMessage] = []

# set up LangChain components once (non-streaming and streaming use the same chain)
_api_key = os.environ.get("DEEPSEEK_API_KEY")
llm = ChatOpenAI(
    model="deepseek-chat",
    api_key=_api_key,
    base_url="https://api.deepseek.com",
    temperature=0.7,
)

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", model_instruct),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

chain = prompt | llm

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

    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        resp = JsonResponse(
            {"error": "DEEPSEEK_API_KEY is not set on the server"},
            status=500,
        )
        return _add_cors_headers(resp)

    # streaming generator: send tokens as they are generated
    def stream_response():
        full_reply_parts: list[str] = []

        # stream tokens/chunks from the model
        for chunk in chain.stream({"input": message, "chat_history": history}):
            token = chunk.content or ""
            if not token:
                continue
            full_reply_parts.append(token)
            # send raw text chunks; frontend reads the stream and appends
            yield token

        # after streaming is done, update history with full reply
        full_reply = "".join(full_reply_parts)
        history.append(HumanMessage(content=message))
        history.append(AIMessage(content=full_reply))

    resp = StreamingHttpResponse(stream_response(), content_type="text/plain; charset=utf-8")
    return _add_cors_headers(resp)

