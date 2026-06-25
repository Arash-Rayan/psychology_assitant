'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { PsychTestDefinition, PsychTestResult } from '@/constants/psychTests';
import styles from './PsychTestRunner.module.css';

const STORAGE_KEY = 'psych-test-results';

export interface SavedTestResult {
  testId: string;
  testTitle: string;
  completedAt: string;
  result: PsychTestResult;
}

function saveResult(entry: SavedTestResult) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: SavedTestResult[] = raw ? JSON.parse(raw) : [];
    list.unshift(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
  } catch {
    /* ignore storage errors */
  }
}

interface PsychTestRunnerProps {
  test: PsychTestDefinition;
  onBack: () => void;
  onComplete?: (result: PsychTestResult) => void;
}

export function PsychTestRunner({ test, onBack, onComplete }: PsychTestRunnerProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [missingIds, setMissingIds] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<PsychTestResult | null>(null);

  const answeredCount = useMemo(
    () => test.questions.filter((q) => answers[q.id] !== undefined).length,
    [answers, test.questions],
  );

  const progressPct = Math.round((answeredCount / test.questions.length) * 100);

  const handleSelect = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setMissingIds((prev) => {
      if (!prev.has(questionId)) return prev;
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });
  };

  const handleSubmit = () => {
    const missing = test.questions.filter((q) => answers[q.id] === undefined).map((q) => q.id);
    if (missing.length > 0) {
      setMissingIds(new Set(missing));
      const first = document.getElementById(`question-${missing[0]}`);
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const scored = test.score(answers);
    setResult(scored);
    setSubmitted(true);
    saveResult({
      testId: test.id,
      testTitle: test.title,
      completedAt: new Date().toISOString(),
      result: scored,
    });
    onComplete?.(scored);
  };

  if (submitted && result) {
    return (
      <div className={styles.root} dir="rtl">
        <div className={styles.topBar}>
          <button type="button" className={styles.backButton} onClick={onBack}>
            <ArrowRight size={16} />
            بازگشت به فهرست تست‌ها
          </button>
        </div>

        <div className={styles.resultCard}>
          <h2 className={styles.resultTitle}>نتیجهٔ {test.title}</h2>
          <div className={styles.scoreBadge}>
            <span>{result.totalScore}</span>
            <span>از {result.maxScore}</span>
          </div>
          {result.severityLabel && (
            <span className={styles.severityBadge}>سطح: {result.severityLabel}</span>
          )}
          <p className={styles.interpretation}>{result.interpretation}</p>
          {result.domains && result.domains.length > 0 && (
            <div className={styles.domainGrid}>
              {result.domains.map((d) => (
                <div key={d.key} className={styles.domainItem}>
                  <div className={styles.domainLabel}>{d.label}</div>
                  <div className={styles.domainScore}>
                    {d.score} از {d.max}
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className={styles.disclaimer}>
            این نتیجه صرفاً برای غربالگری و خودآگاهی است و جایگزین تشخیص یا درمان توسط
            روانشناس نیست.
          </p>
          <button type="button" className={styles.submitButton} onClick={onBack}>
            <CheckCircle2 size={18} />
            اتمام
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root} dir="rtl">
      <div className={styles.topBar}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          <ArrowRight size={16} />
          بازگشت
        </button>
        <div className={styles.progressWrap}>
          <div className={styles.progressLabel}>
            <span>پیشرفت پاسخ‌دهی</span>
            <span>
              {answeredCount} از {test.questions.length}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      <div className={styles.headerCard}>
        <h2 className={styles.title}>{test.title}</h2>
        <p className={styles.subtitle}>{test.subtitle}</p>
        <p className={styles.description}>{test.description}</p>
      </div>

      {missingIds.size > 0 && (
        <div className={styles.errorBanner}>
          لطفاً به همهٔ سوالات پاسخ دهید. {missingIds.size} سوال بدون پاسخ مانده است.
        </div>
      )}

      <div className={styles.questions}>
        {test.questions.map((question, index) => {
          const selected = answers[question.id];
          const isMissing = missingIds.has(question.id);
          return (
            <div
              key={question.id}
              id={`question-${question.id}`}
              className={`${styles.questionCard} ${isMissing ? styles.questionCardMissing : ''}`}
            >
              <div className={styles.questionHeader}>
                <span className={styles.questionNumber}>{index + 1}</span>
                <p className={styles.questionText}>{question.text}</p>
              </div>
              <div className={styles.options} role="radiogroup" aria-label={question.text}>
                {(question.options ?? test.options ?? []).map((opt) => {
                  const isSelected = selected === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`${styles.optionLabel} ${isSelected ? styles.optionLabelSelected : ''}`}
                    >
                      <input
                        type="radio"
                        className={styles.optionInput}
                        name={question.id}
                        value={opt.value}
                        checked={isSelected}
                        onChange={() => handleSelect(question.id, opt.value)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.submitRow}>
        <button type="button" className={styles.submitButton} onClick={handleSubmit}>
          <CheckCircle2 size={18} />
          ثبت و مشاهدهٔ نتیجه
        </button>
      </div>
    </div>
  );
}

export function loadSavedTestResults(): SavedTestResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
