export type PreConsultSubject = 'couples' | 'individual' | 'pre_marriage';

/** پیام‌های راه‌اندازی سوال اول — فقط برای LLM؛ در UI مراجع نمایش داده نمی‌شوند */
export function isInternalPreConsultUserMessage(content: string): boolean {
  const text = content.trim();
  if (!text) return true;
  if (text.startsWith('[موضوع پیش‌مشاوره:') && text.includes('سوال اول را بپرس')) {
    return true;
  }
  if (text.startsWith('کاربر موضوع «') && text.includes('سوال اول را بپرس')) {
    return true;
  }
  return false;
}

export function filterUserVisiblePreConsultMessages<
  T extends { role: string; content: string },
>(messages: T[]): T[] {
  return messages.filter(
    (m) =>
      m.role === 'assistant' ||
      (m.role === 'user' && !isInternalPreConsultUserMessage(m.content)),
  );
}

export const PRE_CONSULT_SUBJECT_IDS: PreConsultSubject[] = [
  'couples',
  'individual',
  'pre_marriage',
];

export function parsePreConsultSubject(value: unknown): PreConsultSubject | null {
  if (
    typeof value === 'string' &&
    PRE_CONSULT_SUBJECT_IDS.includes(value as PreConsultSubject)
  ) {
    return value as PreConsultSubject;
  }
  return null;
}
