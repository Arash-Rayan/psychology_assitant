export type VoiceTargetField =
  | 'chiefComplaint'
  | 'historyBackground'
  | 'sessionObjective'
  | 'summary'
  | 'formulation'
  | 'treatmentPlan'
  | 'homework'
  | 'nextSessionGoals'
  | 'considerations';

export const VOICE_FIELD_OPTIONS: { value: VoiceTargetField; label: string }[] = [
  { value: 'summary', label: 'خلاصه جلسه' },
  { value: 'chiefComplaint', label: 'شکایت اصلی مراجع' },
  { value: 'historyBackground', label: 'پیشینه و سابقه مشکل' },
  { value: 'sessionObjective', label: 'دستور و هدف جلسه فعلی' },
  { value: 'formulation', label: 'فرمولاسیون و تحلیل بالینی' },
  { value: 'treatmentPlan', label: 'طرح درمان' },
  { value: 'homework', label: 'تکالیف و تمرین‌های خانگی' },
  { value: 'nextSessionGoals', label: 'اهداف جلسه بعد' },
  { value: 'considerations', label: 'ملاحظات درمانگر' },
];
