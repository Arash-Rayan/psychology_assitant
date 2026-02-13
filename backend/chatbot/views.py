import json
import os

from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt

from openai import OpenAI
from .prompts.interview import prompt

def _add_cors_headers(response: JsonResponse) -> JsonResponse:
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    return response


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

    client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content":prompt},
                {"role": "user", "content": message},
            ],
            stream=False,
            temperature = 0,
        )
        reply = response.choices[0].message.content
    except Exception:
        resp = JsonResponse(
            {"error": "Failed to get response from language model"},
            status=502,
        )
        return _add_cors_headers(resp)

    resp = JsonResponse({"reply": reply})
    return _add_cors_headers(resp)

