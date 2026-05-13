import type { Patient } from '@/components/PatientCard';
import type { PatientDetail } from '@/components/PatientDetailView';

/** برای لیست مراجعین و SessionNotesView — از PatientDetail یک Patient سبک می‌سازد */
export function patientDetailToPatient(p: PatientDetail): Patient {
  return {
    id: p.id,
    name: p.name,
    status: p.status,
    lastActivity: p.lastSession,
    moodTrend:
      p.monthlyMood.length >= 2
        ? p.monthlyMood[p.monthlyMood.length - 1].mood > p.monthlyMood[0].mood
          ? 'up'
          : p.monthlyMood[p.monthlyMood.length - 1].mood < p.monthlyMood[0].mood
            ? 'down'
            : 'stable'
        : 'stable',
    sessionsCount: p.sessionsCount,
    lastMood: p.overallScore,
  };
}
