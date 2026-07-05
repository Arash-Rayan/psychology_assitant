import {
  ANALYSIS_AGENTS,
  defaultOutputsForAgent,
  getAnalysisAgent,
  type AnalysisAgentId,
} from '@/constants/analysisAgents';
import { getAnalysisItemsForAgent } from '@/constants/analysisDemoData';
import {
  buildAgentTimeline,
  buildEmotionalStateLine,
  type IntensityTrend,
} from '@/utils/patientAgentTimeline';

export type EmotionalStateBand = 'low' | 'moderate' | 'high';

export const EMOTIONAL_STATE_BANDS: Array<{
  value: EmotionalStateBand;
  label: string;
  hint: string;
}> = [
  { value: 'low', label: 'خلق پایین', hint: '۰–۳' },
  { value: 'moderate', label: 'خلق متوسط', hint: '۴–۶' },
  { value: 'high', label: 'خلق بالا', hint: '۷–۱۰' },
];

export const EMOTIONAL_TREND_OPTIONS: Array<{
  value: IntensityTrend;
  label: string;
}> = [
  { value: 'up', label: 'افزایش شدت' },
  { value: 'down', label: 'کاهش شدت' },
  { value: 'stable', label: 'بدون تغییر معنادار' },
];

function bandFromMood(intensity: number): EmotionalStateBand {
  if (intensity <= 3) return 'low';
  if (intensity <= 6) return 'moderate';
  return 'high';
}

function notableThreshold(scaleMax: number): number {
  return scaleMax > 10 ? Math.round(scaleMax * 0.55) : 6;
}

export function getPatientEmotionalProfile(
  patientId: string,
  sessionCount: number,
): {
  intensity: number;
  trend: IntensityTrend;
  band: EmotionalStateBand;
  summary: string;
} {
  const line = buildEmotionalStateLine(patientId, sessionCount);
  return {
    intensity: line.intensity,
    trend: line.trend,
    band: bandFromMood(line.intensity),
    summary: line.summary,
  };
}

export function getPatientAgentTopScore(
  patientId: string,
  sessionCount: number,
  agentId: AnalysisAgentId,
): number {
  const demoItems = getAnalysisItemsForAgent(agentId, patientId);
  if (demoItems.length > 0) {
    return demoItems[0]?.score ?? 0;
  }

  const agent = getAnalysisAgent(agentId);
  const outputKeys = defaultOutputsForAgent(agentId);
  const timeline = buildAgentTimeline(patientId, sessionCount, agentId, outputKeys);
  const last = timeline[timeline.length - 1];
  if (!last) return 0;

  return Math.max(...outputKeys.map((key) => last.values[key] ?? 0));
}

export function patientHasNotableAgentFinding(
  patientId: string,
  sessionCount: number,
  agentId: AnalysisAgentId,
): boolean {
  const agent = getAnalysisAgent(agentId);
  const topScore = getPatientAgentTopScore(patientId, sessionCount, agentId);
  return topScore >= notableThreshold(agent.scaleMax);
}

export function countPatientsWithAgent(
  patients: Array<{ id: string; sessionsCount: number }>,
  agentId: AnalysisAgentId,
): number {
  return patients.filter((patient) =>
    patientHasNotableAgentFinding(patient.id, patient.sessionsCount, agentId),
  ).length;
}

export { ANALYSIS_AGENTS };
