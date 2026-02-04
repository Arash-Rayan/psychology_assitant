from ninja import Schema
from typing import Any, Dict, Optional


class ChatRequest(Schema):
    message: str


class ChatResponse(Schema):
    reply: str


class AnalyzeRequest(Schema):
    summary: str
    score_hint: int | None = None


class AnalyzeResponse(Schema):
    analysis: str
    score: int


class SaveRequest(Schema):
    patient_id: str
    conversation_id: str
    summary: str
    score: int
    metadata: Optional[Dict[str, Any]] = None


class SaveResponse(Schema):
    id: int
    status: str

