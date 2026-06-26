"""Soniox async speech-to-text for session note dictation (Persian)."""

from __future__ import annotations

import os

from soniox import SonioxClient
from soniox.types import CreateTranscriptionConfig

DEFAULT_MODEL = "stt-async-v5"
DEFAULT_LANGUAGE = "fa"
MAX_AUDIO_BYTES = 25 * 1024 * 1024  # 25 MB
DEFAULT_WAIT_TIMEOUT_SEC = 300.0

ALLOWED_CONTENT_TYPES = frozenset(
    {
        "audio/webm",
        "audio/ogg",
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/x-wav",
        "audio/mp4",
        "audio/m4a",
        "audio/x-m4a",
        "video/webm",
        "application/octet-stream",
    }
)


class SonioxSTTError(Exception):
    """Raised when Soniox transcription fails or is misconfigured."""


def get_soniox_client() -> SonioxClient:
    api_key = os.environ.get("SONIOX_API_KEY", "").strip()
    if not api_key:
        raise SonioxSTTError("SONIOX_API_KEY is not set on the server")
    return SonioxClient(api_key=api_key)


def transcribe_audio_bytes(
    audio: bytes,
    *,
    filename: str = "recording.webm",
    language: str = DEFAULT_LANGUAGE,
    wait_timeout_sec: float = DEFAULT_WAIT_TIMEOUT_SEC,
) -> dict:
    """
    Upload audio to Soniox, wait for async transcription, return Persian text.

    See: https://soniox.com/docs/sdk/python-SDK/stt/async-transcription
    """
    if not audio:
        raise SonioxSTTError("Empty audio payload")
    if len(audio) > MAX_AUDIO_BYTES:
        raise SonioxSTTError(f"Audio exceeds {MAX_AUDIO_BYTES // (1024 * 1024)} MB limit")

    client = get_soniox_client()
    config = CreateTranscriptionConfig(
        language_hints=[language],
        language_hints_strict=True,
    )

    try:
        transcription = client.stt.transcribe_and_wait(
            model=DEFAULT_MODEL,
            file=audio,
            filename=filename,
            config=config,
            delete_after=False,
            wait_timeout_sec=wait_timeout_sec,
        )
        if transcription.status != "completed":
            detail = transcription.error_message or transcription.status
            raise SonioxSTTError(detail)

        transcript = client.stt.get_transcript(transcription.id)
        try:
            client.stt.destroy(transcription.id)
        except Exception:
            pass
    except SonioxSTTError:
        raise
    except TimeoutError as exc:
        raise SonioxSTTError("Soniox transcription timed out") from exc
    except Exception as exc:
        raise SonioxSTTError(f"Soniox transcription failed: {exc}") from exc

    text = (transcript.text or "").strip()
    return {
        "text": text,
        "language": language,
        "model": DEFAULT_MODEL,
        "token_count": len(transcript.tokens) if transcript.tokens else 0,
    }
