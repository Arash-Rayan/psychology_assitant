'use client';

import { motion } from 'motion/react';
import styles from '@/components/SchemaAnalysisCard.module.css';

export interface SchemaAnalysisCardData {
  نمره: number;
  شواهد: string[];
  باور_بنیادین?: string;
  تحلیل_بالینی?: string;
  خلاصه?: string;
}

interface SchemaAnalysisCardProps {
  name: string;
  schema: SchemaAnalysisCardData;
  /** ۱۰۰ برای طرحواره، ۱۰ برای سایر agentها */
  maxScore?: 10 | 100;
}

function progressBarClass(score: number, maxScore: 10 | 100) {
  if (maxScore === 10) {
    if (score >= 8) return 'bg-[#eb5757]';
    if (score >= 5) return 'bg-[#d97706]';
    return 'bg-primary';
  }
  if (score >= 90) return 'bg-[#eb5757]';
  if (score >= 80) return 'bg-[#d97706]';
  return 'bg-primary';
}

function formatScore(score: number) {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

export function SchemaAnalysisCard({
  name,
  schema,
  maxScore = 100,
}: SchemaAnalysisCardProps) {
  const progressPercent = (schema.نمره / maxScore) * 100;
  const maxScoreLabel = maxScore === 10 ? '/۱۰' : '/۱۰۰';
  const footerTitle = schema.تحلیل_بالینی
    ? 'تحلیل بالینی'
    : schema.خلاصه
      ? 'خلاصه'
      : null;
  const footerText = schema.تحلیل_بالینی ?? schema.خلاصه;

  return (
    <article
      className="rounded-xl border border-border bg-white p-6 shadow-sm"
      dir="rtl"
    >
      <header className="mb-5 flex items-start justify-between gap-4 border-b border-border/50 pb-4">
        <div className="min-w-0 text-right">
          <h3 className="text-lg text-foreground">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">احتمال مدل</p>
        </div>
        <div className="shrink-0 text-left leading-none">
          <span className="text-3xl font-semibold tabular-nums text-foreground">
            {formatScore(schema.نمره)}
          </span>
          <span className="mr-1 text-sm text-muted-foreground">{maxScoreLabel}</span>
        </div>
      </header>

      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${progressBarClass(schema.نمره, maxScore)}`}
        />
      </div>

      {schema.شواهد.length > 0 && (
        <section className="mb-6">
          <h4 className="mb-3 text-right text-sm text-muted-foreground">شواهد</h4>
          <div className="space-y-3">
            {schema.شواهد.map((evidence, index) => (
              <div
                key={`${name}-evidence-${index}`}
                className="border-r-2 border-border pr-4 text-right"
              >
                <p className="text-sm leading-8 text-foreground">{evidence}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-4">
        {schema.باور_بنیادین && (
          <section className={styles.beliefSection}>
            <h4 className={styles.beliefTitle}>باور بنیادین</h4>
            <p className={styles.sectionText}>{schema.باور_بنیادین}</p>
          </section>
        )}

        {footerTitle && footerText && (
          <section className={styles.analysisSection}>
            <h4 className={styles.analysisTitle}>{footerTitle}</h4>
            <p className={styles.sectionText}>{footerText}</p>
          </section>
        )}
      </div>
    </article>
  );
}
