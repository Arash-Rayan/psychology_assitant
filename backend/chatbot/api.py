from ninja import NinjaAPI
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db import transaction

from .schemas import (
    ChatRequest,
    ChatResponse,
    AnalyzeRequest,
    AnalyzeResponse,
    SaveRequest,
    SaveResponse,
)
from .services import chat_with_llm, analyze_with_llm
from .models import AnalysisRecord

api = NinjaAPI(title="Psychological Chatbot API")


@api.post("/chat", response=ChatResponse)
def chat_endpoint(request, payload: ChatRequest):
    reply = chat_with_llm(payload.message)
    return {"reply": reply}


@api.post("/analyze", response=AnalyzeResponse)
def analyze_endpoint(request, payload: AnalyzeRequest):
    result = analyze_with_llm(payload.summary, payload.score_hint)
    return {"analysis": result["analysis"], "score": result["score"]}


@api.post("/save", response=SaveResponse)
@transaction.atomic
def save_analysis_endpoint(request, payload: SaveRequest):
    record = AnalysisRecord.objects.create(
        patient_id=payload.patient_id,
        conversation_id=payload.conversation_id,
        summary=payload.summary,
        score=payload.score,
        metadata=payload.metadata or {},
    )
    return {"id": record.id, "status": "saved"}

