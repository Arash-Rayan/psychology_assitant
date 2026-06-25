'use client';

import { motion } from 'motion/react';
import { useMemo } from 'react';
import { X, Brain, Heart } from 'lucide-react';
import { PatientAgentIntensityPanel } from './PatientAgentIntensityPanel';
import { buildEmotionalStateLine } from '@/utils/patientAgentTimeline';
import styles from './PatientDetailView.module.css';

export interface Schema {
  name: string;
  severity: 'low' | 'medium' | 'high';
  frequency: number;
  lastDetected: string;
  description: string;
}

export interface BehaviorPattern {
  pattern: string;
  occurrences: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export type ClinicalEngagement = 'new_intake' | 'established';

export interface PatientDetail {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  clinicalEngagement: ClinicalEngagement;
  assignedDoctorId: string;
  status: 'safe' | 'attention' | 'urgent';
  overallScore: number;
  schemas: Schema[];
  behaviors: BehaviorPattern[];
  monthlyMood: Array<{
    date: string;
    mood: number;
    anxiety: number;
    depression: number;
  }>;
  aiInsights: string[];
  chatbotSummary: {
    mainTopic: 'ازدواج' | 'روابط' | 'فردی' | 'اضطراب' | 'خانواده';
    confidence: number;
    notes: string;
  };
  intakeConversationSummary?: string;
  intakeChatHighlights?: string[];
  /** گفت‌وگوی کامل پیش‌مشاوره برای نمایش به درمانگر */
  intakeChatMessages?: Array<{
    role: 'user' | 'assistant';
    content: string;
    time?: string;
  }>;
  preConsultSubject?: string;
  /** شناسهٔ session در PostgreSQL — برای بارگذاری زنده از API */
  preConsultSessionId?: number;
  assessments: {
    neo: {
      neuroticism: number;
      extraversion: number;
      openness: number;
      agreeableness: number;
      conscientiousness: number;
    };
    depression: number;
    anxiety: number;
    stress: number;
  };
  sessionsCount: number;
  lastSession: string;
}

interface PatientDetailViewProps {
  patient: PatientDetail;
  onClose: () => void;
}

export function PatientDetailView({ patient, onClose }: PatientDetailViewProps) {
  const emotionalLine = useMemo(
    () => buildEmotionalStateLine(patient.id, patient.sessionsCount),
    [patient.id, patient.sessionsCount],
  );

  const statusConfig = {
    safe: { color: '#6fcf97', label: 'وضعیت پایدار' },
    attention: { color: '#f2c94c', label: 'نیاز به توجه' },
    urgent: { color: '#eb5757', label: 'وضعیت فوری' },
  };

  const config = statusConfig[patient.status];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.overlay}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={styles.modal}
        dir="rtl"
      >
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <div
                className={styles.headerIcon}
                style={{
                  background: `linear-gradient(to bottom right, ${config.color}, ${config.color}dd)`,
                }}
              >
                <Brain />
              </div>
              <div className={styles.headerInfo}>
                <div className={styles.headerTopRow}>
                  <h2>{patient.name}</h2>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: config.color }}
                  >
                    {config.label}
                  </span>
                </div>
                <p className={styles.headerMetaCompact}>
                  {patient.age} ساله · {patient.gender} · {patient.sessionsCount} جلسه · آخرین
                  جلسه: {patient.lastSession} · امتیاز کلی:{' '}
                  <strong>{patient.overallScore}/100</strong>
                </p>
                <div className={styles.emotionalStateLine}>
                  <Heart className={styles.emotionalIcon} aria-hidden />
                  <span>{emotionalLine.summary}</span>
                </div>
              </div>
            </div>
            <button type="button" onClick={onClose} className={styles.closeButton}>
              <X />
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <PatientAgentIntensityPanel
            patientId={patient.id}
            sessionCount={patient.sessionsCount}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
