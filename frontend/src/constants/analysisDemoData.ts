import type { AnalysisAgentId } from '@/constants/analysisAgents';
import { TEST_PATIENT_1_AGENT_ITEMS } from '@/constants/analysisDemoDataTest1';
import { TEST_PATIENT_2_AGENT_ITEMS } from '@/constants/analysisDemoDataTest2';
import { TEST_PATIENT_3_AGENT_ITEMS } from '@/constants/analysisDemoDataTest3';
import { TEST_PATIENT_AR_AGENT_ITEMS } from '@/constants/analysisDemoDataTestAr';

export interface AnalysisResultItem {
  key: string;
  label: string;
  score: number;
  /** خلاصهٔ کوتاه برای نمایش در داشبورد */
  briefSummary?: string;
  /** دادهٔ داخلی دمو — در UI نمایش داده نمی‌شود */
  evidence?: string[];
  coreBelief?: string;
  clinicalAnalysis?: string;
  summary?: string;
}

export function getDisplaySummary(item: AnalysisResultItem): string {
  return item.summary ?? item.clinicalAnalysis ?? item.briefSummary ?? '';
}

const PATIENT_AGENT_ITEMS: Record<string, Record<AnalysisAgentId, AnalysisResultItem[]>> = {
  'test-patient-1': TEST_PATIENT_1_AGENT_ITEMS,
  'test-patient-2': TEST_PATIENT_2_AGENT_ITEMS,
  'test-patient-3': TEST_PATIENT_3_AGENT_ITEMS,
  'test-patient-ar': TEST_PATIENT_AR_AGENT_ITEMS,
};

const DEFAULT_TEST_PATIENT_ID = 'test-patient-2';

function resolvePatientAgentItems(
  patientId?: string,
): Record<AnalysisAgentId, AnalysisResultItem[]> {
  if (patientId && PATIENT_AGENT_ITEMS[patientId]) {
    return PATIENT_AGENT_ITEMS[patientId];
  }
  return PATIENT_AGENT_ITEMS[DEFAULT_TEST_PATIENT_ID];
}

export function getAnalysisItemsForAgent(
  agentId: AnalysisAgentId,
  patientId?: string,
): AnalysisResultItem[] {
  const items = [...(resolvePatientAgentItems(patientId)[agentId] ?? [])];
  return items.sort((a, b) => b.score - a.score);
}

/** تعداد آیتم‌های خروجی یک agent برای مراجع (۰ = router اجرا نکرده یا نتیجه‌ای نداشت) */
export function getAgentOutputCount(
  agentId: AnalysisAgentId,
  patientId?: string,
): number {
  return getAnalysisItemsForAgent(agentId, patientId).length;
}

export function getTopAnalysisItem(
  agentId: AnalysisAgentId,
  patientId?: string,
): AnalysisResultItem | null {
  const items = getAnalysisItemsForAgent(agentId, patientId);
  return items[0] ?? null;
}

export function getAnalysisItemByKey(
  agentId: AnalysisAgentId,
  key: string,
  patientId?: string,
): AnalysisResultItem | undefined {
  return resolvePatientAgentItems(patientId)[agentId]?.find((i) => i.key === key);
}
