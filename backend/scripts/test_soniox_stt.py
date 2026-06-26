#!/usr/bin/env python
"""
Test Soniox STT with a local audio file.

Usage (from backend/):
  python scripts/test_soniox_stt.py path/to/recording.webm

Requires SONIOX_API_KEY in backend/.env or environment.
"""

from __future__ import annotations

import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from dotenv import load_dotenv

load_dotenv(BACKEND_DIR / ".env")

from chatbot.soniox_stt import SonioxSTTError, transcribe_audio_bytes  # noqa: E402


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python scripts/test_soniox_stt.py <audio-file>")
        return 1

    audio_path = Path(sys.argv[1])
    if not audio_path.is_file():
        print(f"File not found: {audio_path}")
        return 1

    audio = audio_path.read_bytes()
    print(f"Transcribing {audio_path.name} ({len(audio)} bytes)...")

    try:
        result = transcribe_audio_bytes(audio, filename=audio_path.name)
    except SonioxSTTError as exc:
        print(f"Error: {exc}")
        return 1

    print("\n--- Transcript ---\n")
    print(result["text"] or "(empty)")
    print(f"\n--- tokens: {result['token_count']} ---")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
