/**
 * تحلیل‌گرهای هوش مصنوعی — هم‌راستا با SessionNotesView و backend/chatbot/prompts
 */

export type AnalysisAgentId =
  | 'emotional_state'
  | 'schema'
  | 'attachment'
  | 'clinical_disorder'
  | 'cognitive_distortion'
  | 'personal_train'
  | 'relational_pattern'
  | 'functional_level'
  | 'risk_indicators';

export interface AnalysisOutputOption {
  key: string;
  label: string;
}

export interface AnalysisAgentDef {
  id: AnalysisAgentId;
  label: string;
  outputs: AnalysisOutputOption[];
  scaleMax: number;
}

/** همان تحلیل‌گرهایی که در یادداشت جلسه / بک‌اند برای تحلیل مکالمه استفاده می‌شوند */
export const ANALYSIS_AGENTS: AnalysisAgentDef[] = [
  {
    id: 'emotional_state',
    label: 'حالت هیجانی',
    scaleMax: 10,
    outputs: [{ key: 'mood', label: 'خلق' }],
  },
  {
    id: 'schema',
    label: 'طرحواره',
    scaleMax: 100,
    outputs: [
      { key: 'defectiveness_shame', label: 'نقص / شرم' },
      { key: 'emotional_deprivation', label: 'محرومیت هیجانی' },
      { key: 'enmeshment', label: 'درهم‌تنیدگی / خود تحول‌نیافته' },
      { key: 'mistrust_abuse', label: 'بدبینی / سوءاستفاده' },
    ],
  },
  {
    id: 'attachment',
    label: 'دلبستگی',
    scaleMax: 10,
    outputs: [
      { key: 'anxious_preoccupied', label: 'اضطرابی / دوسوگرا' },
      { key: 'avoidant_dismissive', label: 'اجتنابی / طردکننده' },
      { key: 'disorganized', label: 'آشفته (ترسناک-اجتنابی)' },
    ],
  },
  {
    id: 'clinical_disorder',
    label: 'اختلالات بالینی',
    scaleMax: 100,
    outputs: [
      { key: 'major_depression', label: 'اختلال افسردگی اساسی' },
      { key: 'generalized_anxiety', label: 'اختلال اضطراب فراگیر' },
    ],
  },
  {
    id: 'cognitive_distortion',
    label: 'تحریف‌های شناختی',
    scaleMax: 10,
    outputs: [
      { key: 'all_or_nothing', label: 'تفکر همه یا هیچ' },
      { key: 'mind_reading', label: 'ذهن‌خوانی' },
      { key: 'negative_future', label: 'پیش‌بینی منفی آینده' },
      { key: 'personalization', label: 'شخصی‌سازی' },
      { key: 'labeling', label: 'برچسب‌زنی' },
    ],
  },
  {
    id: 'personal_train',
    label: 'ویژگی‌های شخصیتی',
    scaleMax: 10,
    outputs: [
      { key: 'neuroticism', label: 'روان‌رنجوری (NEO)' },
      { key: 'conscientiousness', label: 'وجدان‌کاری (NEO)' },
      { key: 'openness', label: 'تجربه‌گری (NEO)' },
    ],
  },
  {
    id: 'relational_pattern',
    label: 'الگوهای رابطه‌ای',
    scaleMax: 10,
    outputs: [
      { key: 'recurrent_conflict', label: 'الگوی تعارض تکرارشونده' },
      { key: 'unhealthy_dependence', label: 'وابستگی ناسالم' },
      { key: 'push_pull', label: 'چرخه طرد-جذب' },
      { key: 'controlling', label: 'رفتار کنترل‌گرانه' },
    ],
  },
  {
    id: 'functional_level',
    label: 'سطح عملکرد',
    scaleMax: 10,
    outputs: [
      { key: 'social', label: 'عملکرد اجتماعی' },
      { key: 'concentration', label: 'مشکل تمرکز / توجه' },
    ],
  },
  {
    id: 'risk_indicators',
    label: 'شاخص‌های ریسک',
    scaleMax: 10,
    outputs: [
      { key: 'suicidal_thoughts', label: 'افکار خودکشی' },
      { key: 'self_harm', label: 'آسیب به خود' },
      { key: 'substance_abuse', label: 'سوءمصرف مواد' },
      { key: 'functional_breakdown', label: 'فروپاشی شدید عملکرد' },
    ],
  },
];

export const DEFAULT_ANALYSIS_AGENT: AnalysisAgentId = 'emotional_state';

export function getAnalysisAgent(id: AnalysisAgentId): AnalysisAgentDef {
  return ANALYSIS_AGENTS.find((a) => a.id === id) ?? ANALYSIS_AGENTS[0];
}

export function defaultOutputsForAgent(agentId: AnalysisAgentId): string[] {
  const agent = getAnalysisAgent(agentId);
  if (agentId === 'emotional_state') return ['mood'];
  const top = agent.outputs[0]?.key;
  return top ? [top] : [];
}
