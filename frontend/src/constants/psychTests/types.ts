export interface LikertOption {
  value: number;
  label: string;
}

export interface PsychTestQuestion {
  id: string;
  /** عنوان بند (BDI) یا جملهٔ آزمون (NEO) */
  text: string;
  /** BDI-II: چهار جملهٔ اختصاصی هر بند */
  options?: LikertOption[];
  reverseScored?: boolean;
  domain?: string;
}

export interface PsychTestDefinition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  /** گزینه‌های پیش‌فرض (مثلاً NEO) — در BDI هر سوال گزینهٔ خودش را دارد */
  options?: LikertOption[];
  questions: PsychTestQuestion[];
  score: (answers: Record<string, number>) => PsychTestResult;
}

export interface PsychTestResult {
  totalScore: number;
  maxScore: number;
  interpretation: string;
  severityLabel?: string;
  domains?: Array<{ key: string; label: string; score: number; max: number }>;
}
