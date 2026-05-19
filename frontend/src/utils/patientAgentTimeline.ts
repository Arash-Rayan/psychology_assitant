import {
  ANALYSIS_AGENTS,
  DEFAULT_ANALYSIS_AGENT,
  defaultOutputsForAgent,
  getAnalysisAgent,
  type AnalysisAgentId,
} from '@/constants/analysisAgents';

export type { AnalysisAgentId as AgentId };
export { ANALYSIS_AGENTS as THERAPY_AGENTS, DEFAULT_ANALYSIS_AGENT as DEFAULT_AGENT };
export { defaultOutputsForAgent, getAnalysisAgent as getAgentById };

export interface TimelinePoint {
  label: string;
  values: Record<string, number>;
}

function hashPatient(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) >>> 0;
  }
  return h || 1;
}

function seededValue(seed: number, session: number, key: string): number {
  let s = seed;
  for (const ch of key) s = (Math.imul(s, 31) + ch.charCodeAt(0)) >>> 0;
  s = (Math.imul(1664525, s + session * 997) + 1013904223) >>> 0;
  return s / 4294967296;
}

export function buildAgentTimeline(
  patientId: string,
  sessionCount: number,
  agentId: AnalysisAgentId,
  outputKeys: string[],
): TimelinePoint[] {
  const agent = getAnalysisAgent(agentId);
  const seed = hashPatient(patientId);
  const weeks = Math.min(Math.max(sessionCount, 3), 8);

  return Array.from({ length: weeks }, (_, i) => {
    const values: Record<string, number> = {};
    for (const key of outputKeys) {
      const raw = seededValue(seed, i, `${agentId}-${key}`);
      const base =
        agentId === 'emotional_state'
          ? 3 + raw * 6
          : agent.scaleMax <= 10
            ? 2 + raw * 7
            : 25 + raw * 65;
      const drift = agentId === 'risk_indicators' ? i * 0.15 : -i * 0.2;
      const v = Math.round(
        Math.min(agent.scaleMax, Math.max(0, base + drift * (raw > 0.5 ? 1 : -1))),
      );
      values[key] = v;
    }
    return {
      label: `جلسه ${i + 1}`,
      values,
    };
  });
}

export type IntensityTrend = 'up' | 'down' | 'stable';

export function computeIntensityTrend(
  timeline: TimelinePoint[],
  outputKey: string,
  scaleMax = 10,
): IntensityTrend {
  if (timeline.length < 2) return 'stable';
  const first = timeline[0].values[outputKey] ?? 0;
  const last = timeline[timeline.length - 1].values[outputKey] ?? 0;
  const diff = last - first;
  const threshold = scaleMax > 10 ? 8 : 2;
  if (diff >= threshold) return 'up';
  if (diff <= -threshold) return 'down';
  return 'stable';
}

const TREND_LABELS: Record<IntensityTrend, string> = {
  up: 'افزایش شدت',
  down: 'کاهش شدت',
  stable: 'بدون تغییر معنادار',
};

export function trendLabel(trend: IntensityTrend): string {
  return TREND_LABELS[trend];
}

export function buildEmotionalStateLine(
  patientId: string,
  sessionCount: number,
): { summary: string; dominant: string; intensity: number; trend: IntensityTrend } {
  const timeline = buildAgentTimeline(patientId, sessionCount, 'emotional_state', ['mood']);
  const last = timeline[timeline.length - 1]?.values.mood ?? 0;
  const trend = computeIntensityTrend(timeline, 'mood', 10);
  return {
    dominant: 'خلق',
    intensity: last,
    trend,
    summary: `خلق (${last}/۱۰) — ${trendLabel(trend)} در این بازه`,
  };
}
