/**
 * Mirror of backend/chatbot/persian_normalizer.py — keep rules in sync.
 * Applied on the live chat stream so the UI shows correct ZWNJ, not only DB.
 */

const ZWNJ = '\u200c';
const PERSIAN = 'آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی';

const MI = new RegExp(`(?<!\\u200c)\\bمی(?!\\u200c)(?! )([${PERSIAN}])`, 'g');
const NEMI = new RegExp(`(?<!\\u200c)\\bنمی(?!\\u200c)(?! )([${PERSIAN}])`, 'g');
const HA_SUFFIX = new RegExp(
  `([${PERSIAN}]{2,}?)(?<!\\u200c)(ها(?:ی(?:ی|ش|م|ت|مان|شان|تان)?)?)\\b`,
  'g',
);
const TAR_AFTER_YE_HE = new RegExp(
  `([یه])(?<!\\u200c)(تر(?:ین)?)(ه)?(?=\\s|$|[،.!?؟:»"'\\u200c)\\]}])`,
  'g',
);
const EZAFE_AFTER_HE = new RegExp(
  `([${PERSIAN}]ه)(?<!\\u200c)ی(?=\\s|$|[،.!?؟:»"'\\u200c)\\]}])`,
  'g',
);
const HE_AYE = new RegExp(`([${PERSIAN}]ه)(?<!\\u200c)ایه\\b`, 'g');
const COMPOUND_SUFFIX = new RegExp(
  `([${PERSIAN}]{2,})(?<!\\u200c)(نویسی|شناسی|گیری|پذیری|سازی|سنجی)\\b`,
  'g',
);

const FIXED_COMPOUNDS: [RegExp, string][] = [
  [/برنامه(?!\u200c)نویسی/g, `برنامه${ZWNJ}نویسی`],
  [/روان(?!\u200c)شناسی/g, `روان${ZWNJ}شناسی`],
  [/تصمیم(?!\u200c)گیری/g, `تصمیم${ZWNJ}گیری`],
  [/آسیب(?!\u200c)پذیری/g, `آسیب${ZWNJ}پذیری`],
];

export function normalizePersianHalfSpace(text: string): string {
  if (!text) return text;

  let out = text;
  for (const [pattern, repl] of FIXED_COMPOUNDS) {
    out = out.replace(pattern, repl);
  }

  out = out.replace(MI, `می${ZWNJ}$1`);
  out = out.replace(NEMI, `نمی${ZWNJ}$1`);
  out = out.replace(HA_SUFFIX, `$1${ZWNJ}$2`);
  out = out.replace(TAR_AFTER_YE_HE, `$1${ZWNJ}$2$3`);
  out = out.replace(HE_AYE, `$1${ZWNJ}ایه`);
  out = out.replace(EZAFE_AFTER_HE, `$1${ZWNJ}ی`);
  out = out.replace(COMPOUND_SUFFIX, `$1${ZWNJ}$2`);
  out = out.replace(new RegExp(`${ZWNJ}{2,}`, 'g'), ZWNJ);

  return out;
}
