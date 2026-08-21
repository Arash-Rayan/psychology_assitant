"""
Conservative Persian half-space (ZWNJ) insertion.

Handles common LLM omissions without aggressive breakage:
  - می / نمی + continuation  (میکنه → می‌کنه)
  - word + ها / های / …     (نگرانیها → نگرانی‌ها)
  - تر / ترین (+ optional ه) after ی/ه  (درونیتره → درونی‌تره)
  - ezafe ی after ه         (سرچشمهی → سرچشمه‌ی)
  - colloquial ه + ایه      (چرخهایه → چرخه‌ایه when already ه‌ایه shape)
  - common noun+noun compounds (برنامهنویسی → برنامه‌نویسی)
"""

from __future__ import annotations

import re

_ZWNJ = "\u200c"
_PERSIAN = r"آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی"

# می/نمی prefix: only when NOT already followed by ZWNJ or space
_MI = re.compile(rf"(?<!\u200c)\bمی(?!\u200c)(?! )([{_PERSIAN}])")
_NEMI = re.compile(rf"(?<!\u200c)\bنمی(?!\u200c)(?! )([{_PERSIAN}])")

# ها/های/هایی… suffix
_HA_SUFFIX = re.compile(
    rf"([{_PERSIAN}]{{2,}}?)(?<!\u200c)(ها(?:ی(?:ی|ش|م|ت|مان|شان|تان)?)?)\b"
)

# تر/ترین after ی or ه; allow trailing ه (درونیتره)
_TAR_AFTER_YE_HE = re.compile(
    rf"([یه])(?<!\u200c)(تر(?:ین)?)(ه)?(?=\s|$|[،.!?؟:»\"'\u200c)\]}}])"
)

# ezafe: …ه + ی (سرچشمهی → سرچشمه‌ی). Avoid lone «هی».
_EZAFE_AFTER_HE = re.compile(
    rf"([{_PERSIAN}]ه)(?<!\u200c)ی(?=\s|$|[،.!?؟:»\"'\u200c)\]}}])"
)

# …ه + ایه colloquial (چرخهایه as چرخه+ایه — only when حرف قبل از ه فارسی است)
_HE_AYE = re.compile(
    rf"([{_PERSIAN}]ه)(?<!\u200c)ایه\b"
)

# Safe high-frequency compounds LLMs glue together
_COMPOUND_SUFFIX = re.compile(
    rf"([{_PERSIAN}]{{2,}})(?<!\u200c)"
    rf"(نویسی|شناسی|گیری|پذیری|سازی|سنجی)\b"
)

_FIXED_COMPOUNDS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"برنامه(?!\u200c)نویسی"), f"برنامه{_ZWNJ}نویسی"),
    (re.compile(r"روان(?!\u200c)شناسی"), f"روان{_ZWNJ}شناسی"),
    (re.compile(r"تصمیم(?!\u200c)گیری"), f"تصمیم{_ZWNJ}گیری"),
    (re.compile(r"آسیب(?!\u200c)پذیری"), f"آسیب{_ZWNJ}پذیری"),
]


def normalize_half_space(text: str) -> str:
    """Insert ZWNJ where Persian orthography clearly requires it."""
    if not text:
        return text

    for pattern, repl in _FIXED_COMPOUNDS:
        text = pattern.sub(repl, text)

    text = _MI.sub(f"می{_ZWNJ}\\1", text)
    text = _NEMI.sub(f"نمی{_ZWNJ}\\1", text)
    text = _HA_SUFFIX.sub(f"\\1{_ZWNJ}\\2", text)
    text = _TAR_AFTER_YE_HE.sub(f"\\1{_ZWNJ}\\2\\3", text)
    text = _HE_AYE.sub(f"\\1{_ZWNJ}ایه", text)
    text = _EZAFE_AFTER_HE.sub(f"\\1{_ZWNJ}ی", text)
    text = _COMPOUND_SUFFIX.sub(f"\\1{_ZWNJ}\\2", text)

    # collapse accidental double ZWNJ
    text = text.replace(_ZWNJ * 2, _ZWNJ)
    return text
