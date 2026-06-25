'use client';

import { useEffect, useState } from 'react';
import { Brain, ClipboardCheck, HeartPulse } from 'lucide-react';
import { PSYCH_TESTS, type PsychTestDefinition } from '@/constants/psychTests';
import { PsychTestRunner, loadSavedTestResults, type SavedTestResult } from './PsychTestRunner';
import styles from './TestsView.module.css';

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function TestsView() {
  const [activeTest, setActiveTest] = useState<PsychTestDefinition | null>(null);
  const [recent, setRecent] = useState<SavedTestResult[]>([]);

  useEffect(() => {
    setRecent(loadSavedTestResults());
  }, []);

  const handleBack = () => {
    setActiveTest(null);
    setRecent(loadSavedTestResults());
  };

  if (activeTest) {
    return <PsychTestRunner test={activeTest} onBack={handleBack} />;
  }

  return (
    <div className={styles.root} dir="rtl">
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>آزمون‌های روان‌شناختی</h2>
        <p className={styles.introText}>
          تست‌های استاندارد BDI-II (۲۱ گروه جمله) و NEO-FFI (۶۰ سوال) با متن معتبر فارسی. پس از
          پاسخ به همهٔ سوالات، نتیجه را ثبت و مشاهده کنید.
        </p>
      </div>

      <div className={styles.grid}>
        {PSYCH_TESTS.map((test) => (
          <article key={test.id} className={styles.card}>
            <div className={styles.cardIcon}>
              {test.id === 'bdi2' ? <HeartPulse size={20} /> : <Brain size={20} />}
            </div>
            <h3 className={styles.cardTitle}>{test.title}</h3>
            <p className={styles.cardSubtitle}>{test.subtitle}</p>
            <p className={styles.cardMeta}>{test.questions.length} سوال</p>
            <button
              type="button"
              className={styles.startButton}
              onClick={() => setActiveTest(test)}
            >
              <ClipboardCheck size={16} />
              شروع تست
            </button>
          </article>
        ))}
      </div>

      <section className={styles.recentSection}>
        <h3 className={styles.recentTitle}>نتایج اخیر</h3>
        {recent.length === 0 ? (
          <p className={styles.recentEmpty}>هنوز تستی ثبت نشده است.</p>
        ) : (
          <div className={styles.recentList}>
            {recent.slice(0, 5).map((item, i) => (
              <div key={`${item.testId}-${item.completedAt}-${i}`} className={styles.recentItem}>
                <span>{item.testTitle}</span>
                <span>
                  {item.result.totalScore} از {item.result.maxScore}
                  {item.result.severityLabel ? ` · ${item.result.severityLabel}` : ''}
                  {' · '}
                  {formatDate(item.completedAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
