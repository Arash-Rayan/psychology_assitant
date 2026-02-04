import os
from typing import Dict, Any

# Placeholder stubs. Replace with real LLM calls (OpenAI, etc.)


def chat_with_llm(message: str) -> str:
    # TODO: wire up OpenAI/other LLM here
    # Example: return openai_response
    return f"Stubbed chatbot reply to: {message}"


def analyze_with_llm(summary: str, score_hint: int | None = None) -> Dict[str, Any]:
    # TODO: wire up LLM scoring/analysis here
    # Could return structured analysis + numeric score
    score = score_hint if score_hint is not None else 75
    return {
        "analysis": f"Stubbed analysis for: {summary}",
        "score": score,
    }

