import conversationAgentOutput from '@/constants/conversationAgentOutput.json';
import conversationPatientAr from '@/constants/conversationPatientAr.json';

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

const CONVERSATION_BY_PATIENT: Record<string, ConversationTurn[]> = {
  'test-patient-2': conversationAgentOutput.conversation as ConversationTurn[],
  'test-patient-ar': conversationPatientAr.conversation as ConversationTurn[],
};

export function getPatientChatConversation(patientId: string | null | undefined): ConversationTurn[] {
  if (!patientId) return [];
  return CONVERSATION_BY_PATIENT[patientId] ?? [];
}
