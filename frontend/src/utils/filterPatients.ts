import type { PatientDetail } from '@/components/PatientDetailView';
import type { Patient } from '@/components/PatientCard';
import type { SchemaType } from '@/components/SchemaTypes';
import type { AnalysisAgentId } from '@/constants/analysisAgents';
import type { IntensityTrend } from '@/utils/patientAgentTimeline';
import type { EmotionalStateBand } from '@/utils/patientAgentFilter';
import { patientDetailToPatient } from '@/utils/patientDetailToPatient';
import {
  getPatientEmotionalProfile,
  patientHasNotableAgentFinding,
} from '@/utils/patientAgentFilter';

export type PatientStatusFilter = 'all' | 'safe' | 'attention' | 'urgent';
export type SchemaSeverityFilter = 'all' | 'low' | 'medium' | 'high';
export type SchemaMatchMode = 'any' | 'all';
export type PatientSortOption =
  | 'name-asc'
  | 'score-desc'
  | 'score-asc'
  | 'status-urgency'
  | 'sessions-desc';

export type ChatTopic = PatientDetail['chatbotSummary']['mainTopic'];

export const CHAT_TOPICS: ChatTopic[] = [
  'ازدواج',
  'روابط',
  'فردی',
  'اضطراب',
  'خانواده',
];

export interface PatientFilterState {
  search: string;
  status: PatientStatusFilter;
  schemas: SchemaType[];
  schemaMatch: SchemaMatchMode;
  topics: ChatTopic[];
  severity: SchemaSeverityFilter;
  agents: AnalysisAgentId[];
  agentMatch: SchemaMatchMode;
  emotionalBands: EmotionalStateBand[];
  emotionalTrends: IntensityTrend[];
  sortBy: PatientSortOption;
}

export const DEFAULT_PATIENT_FILTERS: PatientFilterState = {
  search: '',
  status: 'all',
  schemas: [],
  schemaMatch: 'any',
  topics: [],
  severity: 'all',
  agents: [],
  agentMatch: 'any',
  emotionalBands: [],
  emotionalTrends: [],
  sortBy: 'score-desc',
};

const STATUS_ORDER: Record<PatientDetail['status'], number> = {
  urgent: 0,
  attention: 1,
  safe: 2,
};

function normalizeSearch(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function matchesSearch(patient: PatientDetail, search: string): boolean {
  if (!search) return true;
  const haystack = normalizeSearch(patient.name);
  const needle = normalizeSearch(search);
  return haystack.includes(needle);
}

function matchesStatus(patient: PatientDetail, status: PatientStatusFilter): boolean {
  if (status === 'all') return true;
  return patient.status === status;
}

function matchesSchemas(
  patient: PatientDetail,
  schemas: SchemaType[],
  schemaMatch: SchemaMatchMode,
): boolean {
  if (schemas.length === 0) return true;
  const patientSchemaNames = patient.schemas.map((s) => s.name);
  if (schemaMatch === 'all') {
    return schemas.every((schema) => patientSchemaNames.includes(schema));
  }
  return schemas.some((schema) => patientSchemaNames.includes(schema));
}

function matchesTopics(patient: PatientDetail, topics: ChatTopic[]): boolean {
  if (topics.length === 0) return true;
  return topics.includes(patient.chatbotSummary.mainTopic);
}

function matchesSeverity(patient: PatientDetail, severity: SchemaSeverityFilter): boolean {
  if (severity === 'all') return true;
  return patient.schemas.some((s) => s.severity === severity);
}

function matchesAgents(
  patient: PatientDetail,
  agents: AnalysisAgentId[],
  agentMatch: SchemaMatchMode,
): boolean {
  if (agents.length === 0) return true;
  const matches = (agentId: AnalysisAgentId) =>
    patientHasNotableAgentFinding(patient.id, patient.sessionsCount, agentId);
  if (agentMatch === 'all') {
    return agents.every(matches);
  }
  return agents.some(matches);
}

function matchesEmotionalBands(
  patient: PatientDetail,
  bands: EmotionalStateBand[],
): boolean {
  if (bands.length === 0) return true;
  const profile = getPatientEmotionalProfile(patient.id, patient.sessionsCount);
  return bands.includes(profile.band);
}

function matchesEmotionalTrends(
  patient: PatientDetail,
  trends: IntensityTrend[],
): boolean {
  if (trends.length === 0) return true;
  const profile = getPatientEmotionalProfile(patient.id, patient.sessionsCount);
  return trends.includes(profile.trend);
}

function sortPatients(
  patients: PatientDetail[],
  sortBy: PatientSortOption,
): PatientDetail[] {
  const sorted = [...patients];
  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name, 'fa');
      case 'score-asc':
        return a.overallScore - b.overallScore;
      case 'score-desc':
        return b.overallScore - a.overallScore;
      case 'status-urgency':
        return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      case 'sessions-desc':
        return b.sessionsCount - a.sessionsCount;
      default:
        return 0;
    }
  });
  return sorted;
}

export function filterPatientDetails(
  patients: PatientDetail[],
  filters: PatientFilterState,
): PatientDetail[] {
  const filtered = patients.filter(
    (patient) =>
      matchesSearch(patient, filters.search) &&
      matchesStatus(patient, filters.status) &&
      matchesSchemas(patient, filters.schemas, filters.schemaMatch) &&
      matchesTopics(patient, filters.topics) &&
      matchesSeverity(patient, filters.severity) &&
      matchesAgents(patient, filters.agents, filters.agentMatch) &&
      matchesEmotionalBands(patient, filters.emotionalBands) &&
      matchesEmotionalTrends(patient, filters.emotionalTrends),
  );
  return sortPatients(filtered, filters.sortBy);
}

export function filterPatients(
  patients: PatientDetail[],
  filters: PatientFilterState,
): Patient[] {
  return filterPatientDetails(patients, filters).map(patientDetailToPatient);
}

export function countPatientsWithSchema(
  patients: PatientDetail[],
  schema: SchemaType,
  filters: PatientFilterState,
): number {
  const baseFilters: PatientFilterState = {
    ...filters,
    schemas: [],
  };
  return filterPatientDetails(patients, baseFilters).filter((patient) =>
    patient.schemas.some((s) => s.name === schema),
  ).length;
}

export function hasActiveFilters(filters: PatientFilterState): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.schemas.length > 0 ||
    filters.topics.length > 0 ||
    filters.severity !== 'all' ||
    filters.agents.length > 0 ||
    filters.emotionalBands.length > 0 ||
    filters.emotionalTrends.length > 0
  );
}

export function hasActivePatientPanelFilters(filters: PatientFilterState): boolean {
  return (
    filters.emotionalBands.length > 0 ||
    filters.emotionalTrends.length > 0 ||
    filters.schemas.length > 0 ||
    filters.topics.length > 0
  );
}
