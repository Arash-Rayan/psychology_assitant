"""
Conservative Persian half-space (ZWNJ) insertion.

Only handles patterns that are unambiguously wrong without ZWNJ:
  - می + verb  (میکنه → می‌کنه)
  - نمی + verb (نمیدونم → نمی‌دونم)
  - word + ها/های/هایی (حرفهای → حرف‌های)
  - word + تر/ترین when preceded by ی or ه (طبیعیتر → طبیعی‌تر, سادهتر → ساده‌تر)

Avoids aggressive suffix matching that breaks real words.
"""

import re

_ZWNJ = "\u200c"

# می/نمی prefix: only when NOT already followed by ZWNJ or space
_MI = re.compile(r"(?<!\u200c)\bمی(?!\u200c)(?! )([بپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی])")
_NEMI = re.compile(r"(?<!\u200c)\bنمی(?!\u200c)(?! )([بپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی])")

# ها/های/هایی suffix: preceded by at least 2 chars of a word, NOT already ZWNJ
_HA_SUFFIX = re.compile(
    r"([آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]{2,}?)(?<!\u200c)(ها(?:ی(?:ی|ش|م|ت|مان|شان|تان)?)?)\b"
)

# تر/ترین after ی or ه (the most common and safe pattern)
_TAR_AFTER_YE_HE = re.compile(
    r"([یه])(?<!\u200c)(تر(?:ین)?)\b"
)


def normalize_half_space(text: str) -> str:
    """Insert ZWNJ where Persian orthography clearly requires it."""
    if not text:
        return text

    text = _MI.sub(f"می{_ZWNJ}\\1", text)
    text = _NEMI.sub(f"نمی{_ZWNJ}\\1", text)
    text = _HA_SUFFIX.sub(f"\\1{_ZWNJ}\\2", text)
    text = _TAR_AFTER_YE_HE.sub(f"\\1{_ZWNJ}\\2", text)

    return text
