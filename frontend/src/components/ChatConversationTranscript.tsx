'use client';

import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle } from 'lucide-react';
import type { ConversationTurn } from '@/constants/conversationAgentOutput';
import chatStyles from '@/components/ChatbotPage.module.css';
import styles from '@/components/ChatConversationTranscript.module.css';

interface ChatConversationTranscriptProps {
  turns: ConversationTurn[];
  patientName?: string;
  messageCount?: number;
}

export function ChatConversationTranscript({
  turns,
  patientName,
  messageCount,
}: ChatConversationTranscriptProps) {
  if (turns.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-white border border-border text-center">
        <p className="text-muted-foreground">گفتگوی چت بات برای این مراجع ثبت نشده است.</p>
      </div>
    );
  }

  const totalMessages = messageCount ?? turns.length;
  const messagesLabel = `${totalMessages.toLocaleString('fa-IR')} پیام`;

  return (
    <div className={styles.embeddedChatCard} dir="rtl">
      <div className={chatStyles.chatHeader}>
        <div className={chatStyles.headerContent}>
          <div className={chatStyles.headerIcon}>
            <MessageCircle />
          </div>
          <div className={chatStyles.headerText}>
            <h2>گفتگوی چت بات</h2>
            <p>
              {patientName ? `مکالمهٔ ${patientName}` : 'مکالمهٔ مراجع با دستیار'}
              {' · '}
              {messagesLabel}
            </p>
          </div>
          <div className={chatStyles.statusContainer}>
            <div className={chatStyles.statusIndicator}>
              <div className={chatStyles.statusDot} />
              <span className={chatStyles.statusText}>ثبت‌شده</span>
            </div>
          </div>
        </div>
      </div>

      <div className={chatStyles.messagesArea}>
        {turns.map((turn, index) => {
          const isUser = turn.role === 'user';
          return (
            <motion.div
              key={`${turn.role}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.4) }}
              className={`${chatStyles.messageContainer} ${
                isUser ? chatStyles.messageContainerUser : chatStyles.messageContainerBot
              }`}
            >
              <div
                className={`${chatStyles.messageBubble} ${
                  isUser ? chatStyles.messageBubbleUser : chatStyles.messageBubbleBot
                }`}
              >
                <div
                  className={`${chatStyles.messageContent} ${
                    isUser ? chatStyles.messageContentUser : chatStyles.messageContentBot
                  }`}
                >
                  {isUser ? (
                    <p className={chatStyles.messageText}>{turn.content}</p>
                  ) : (
                    <div className={`${chatStyles.messageText} ${chatStyles.markdownContent}`}>
                      <ReactMarkdown>{turn.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
                <div className={`${chatStyles.messageMeta} ${!isUser ? chatStyles.messageMetaBot : ''}`}>
                  <span className={chatStyles.messageTime}>{isUser ? 'مراجع' : 'دستیار'}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
