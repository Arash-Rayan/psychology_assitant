import type { PatientDetail } from '@/components/PatientDetailView';
import {
  DEMO_PRE_CONSULT_COUPLES_CHAT,
  DEMO_PRE_CONSULT_COUPLES_HIGHLIGHTS,
  DEMO_PRE_CONSULT_COUPLES_SUMMARY,
  DEMO_PRE_CONSULT_PATIENT_ID,
  PRE_CONSULT_SAMPLE_SUBJECT,
} from '@/constants/demoPreConsultCouplesChat';

/** مراجع جدید با گفت‌وگوی واقعی پیش‌مشاوره زوجین — برای تقویم و داشبورد دکتر */
export function buildDemoPreConsultPatient(): PatientDetail {
  return {
    id: DEMO_PRE_CONSULT_PATIENT_ID,
    name: 'مراجع پیش‌مشاوره (زوجین)',
    age: 34,
    gender: 'زن',
    phone: '۰۹۱۲ ۴۵۶ ۷۸۹۰',
    clinicalEngagement: 'new_intake',
    assignedDoctorId: 'd1',
    status: 'urgent',
    overallScore: 38,
    schemas: [],
    behaviors: [
      {
        pattern: 'تنش و دعوای مکرر در موقعیت‌های روزمره',
        occurrences: 12,
        trend: 'increasing',
      },
    ],
    monthlyMood: [
      {
        date: 'ورود',
        mood: 38,
        anxiety: 72,
        depression: 68,
      },
    ],
    aiInsights: [
      'خشونت فیزیکی و توهین متقابل گزارش شده — نیاز به ارزیابی ایمنی در ویزیت اول',
      'باور سرزنش همسر بابت زایمان زودرس در مرکز دولتی در تعارض‌ها فعال می‌شود',
    ],
    chatbotSummary: {
      mainTopic: 'روابط',
      confidence: 88,
      notes:
        'پیش‌مشاورهٔ زوجین تکمیل شده. مراجع به سردی رابطه، خشونت، ناامیدی و سؤال دربارهٔ امکان ترمیم یا جدایی اشاره کرده است.',
    },
    intakeConversationSummary: DEMO_PRE_CONSULT_COUPLES_SUMMARY,
    intakeChatHighlights: DEMO_PRE_CONSULT_COUPLES_HIGHLIGHTS,
    intakeChatMessages: DEMO_PRE_CONSULT_COUPLES_CHAT,
    preConsultSubject: PRE_CONSULT_SAMPLE_SUBJECT,
    assessments: {
      neo: {
        neuroticism: 78,
        extraversion: 35,
        openness: 42,
        agreeableness: 48,
        conscientiousness: 55,
      },
      depression: 68,
      anxiety: 72,
      stress: 74,
    },
    sessionsCount: 0,
    lastSession: '—',
  };
}
