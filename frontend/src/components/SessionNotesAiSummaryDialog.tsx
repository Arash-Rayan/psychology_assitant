'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Calendar, Loader2, Sparkles } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/components/ui/utils';
import {
  type SessionNoteForSummary,
  generateSessionNotesSummary,
  simulateAiSummaryDelay,
  type NotesSummaryResult,
} from '@/utils/sessionNotesSummary';
import styles from './SessionNotesAiSummaryDialog.module.css';

const LOADING_STEPS = [
  'در حال خواندن یادداشت‌های بازه…',
  'در حال تهیه خلاصهٔ بالینی…',
  'در حال آماده‌سازی گزارش…',
];

function msToInputDate(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function inputDateToMs(value: string, endOfDay = false): number {
  const [y, m, day] = value.split('-').map(Number);
  if (!y || !m || !day) return NaN;
  const date = new Date(y, m - 1, day);
  if (endOfDay) date.setHours(23, 59, 59, 999);
  else date.setHours(0, 0, 0, 0);
  return date.getTime();
}

interface SessionNotesAiSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  notes: SessionNoteForSummary[];
}

export function SessionNotesAiSummaryDialog({
  open,
  onOpenChange,
  patientName,
  notes,
}: SessionNotesAiSummaryDialogProps) {
  const bounds = useMemo(() => {
    if (notes.length === 0) {
      const now = Date.now();
      return { min: now - 90 * 24 * 60 * 60 * 1000, max: now };
    }
    const times = notes.map((n) => n.dateMs);
    return { min: Math.min(...times), max: Math.max(...times) };
  }, [notes]);

  const [fromDate, setFromDate] = useState(() => msToInputDate(bounds.min));
  const [toDate, setToDate] = useState(() => msToInputDate(bounds.max));
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<NotesSummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setFromDate(msToInputDate(bounds.min));
    setToDate(msToInputDate(bounds.max));
    setResult(null);
    setError(null);
    setLoading(false);
    setLoadingStep(0);
  }, [open, bounds.min, bounds.max]);

  const loadingProgressPct =
    Math.round(((loadingStep + 1) / LOADING_STEPS.length) * 100) + '%';

  const handleGenerate = async () => {
    const fromMs = inputDateToMs(fromDate);
    const toMs = inputDateToMs(toDate, true);
    if (Number.isNaN(fromMs) || Number.isNaN(toMs)) {
      setError('لطفاً هر دو تاریخ را به‌درستی انتخاب کنید.');
      return;
    }

    setError(null);
    setResult(null);
    setLoading(true);
    setLoadingStep(0);

    await simulateAiSummaryDelay(setLoadingStep);

    const summary = generateSessionNotesSummary(notes, patientName, fromMs, toMs);
    setLoading(false);

    if (!summary) {
      setError('در این بازهٔ زمانی یادداشتی یافت نشد. بازه را گسترده‌تر کنید.');
      return;
    }

    setResult(summary);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(styles.dialogContent, 'text-right')}
        dir="rtl"
      >
        <header className={styles.header}>
          <h2 className={styles.headerTitle}>
            <span>خلاصهٔ هوشمند پرونده</span>
            <span className={styles.headerIcon} aria-hidden>
              <Brain className="h-5 w-5" />
            </span>
          </h2>
          <p className={styles.headerDesc}>
            بازه را انتخاب کنید تا خلاصهٔ روند درمانی برای{' '}
            <strong>{patientName}</strong> نمایش داده شود.
          </p>
        </header>

        <div className={styles.body}>
          <div className={styles.controlsCard}>
            <div className={styles.dateGrid}>
              <div className="space-y-2">
                <Label htmlFor="summary-from" className="text-right block text-sm font-semibold text-slate-700">
                  از تاریخ
                </Label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <Input
                    id="summary-from"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="h-11 rounded-lg border-slate-200 bg-white pr-10 text-start shadow-sm"
                    dir="ltr"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary-to" className="text-right block text-sm font-semibold text-slate-700">
                  تا تاریخ
                </Label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <Input
                    id="summary-to"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="h-11 rounded-lg border-slate-200 bg-white pr-10 text-start shadow-sm"
                    dir="ltr"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || notes.length === 0}
              className={styles.generateBtn}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال تهیه خلاصه…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  دریافت خلاصه
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-right">
              {error}
            </p>
          )}

          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={styles.loadingCard}
              >
                <div className="flex items-center justify-end gap-2 text-sm font-semibold text-violet-700">
                  <span>{LOADING_STEPS[loadingStep]}</span>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-violet-100">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-l from-violet-600 to-indigo-500"
                    initial={{ width: '5%' }}
                    animate={{ width: loadingProgressPct }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.resultsWrap}
              >
                <div className={styles.reportHeader}>
                  <h3 className={styles.reportMainTitle}>{result.title}</h3>
                  <ul className={styles.reportMetaList}>
                    <li>
                      <span className={styles.reportMetaLabel}>بازه زمانی:</span>{' '}
                      {result.dateRangeLabel}
                    </li>
                    <li>
                      <span className={styles.reportMetaLabel}>تعداد جلسات:</span>{' '}
                      {result.sessionDurationLabel}
                    </li>
                    <li>
                      <span className={styles.reportMetaLabel}>رویکرد درمانی:</span>{' '}
                      {result.approach}
                    </li>
                  </ul>
                </div>

                {result.sections.map((section) => (
                  <section key={section.number} className={styles.numberedSection}>
                    <h4 className={styles.sectionHeading}>
                      <span className={styles.sectionNumber}>{section.number}.</span>
                      {section.title}
                    </h4>
                    {section.intro && (
                      <p className={styles.sectionIntro}>{section.intro}</p>
                    )}
                    {section.body && (
                      <p className={styles.sectionBody}>{section.body}</p>
                    )}
                    {section.items && section.items.length > 0 && (
                      <ul className={styles.labeledList}>
                        {section.items.map((item) => (
                          <li key={`${item.label}-${item.text}`}>
                            {item.label && (
                              <strong className={styles.itemLabel}>{item.label}: </strong>
                            )}
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className={styles.bulletList}>
                        {section.bullets.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}

                {result.insight && (
                  <aside className={styles.insightBox}>
                    <p className={styles.insightTitle}>{result.insight.title}:</p>
                    <p className={styles.insightBody}>{result.insight.body}</p>
                  </aside>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
