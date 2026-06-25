'use client';

import ReactMarkdown from 'react-markdown';
import type { PreConsultChatMessage } from '@/constants/demoPreConsultCouplesChat';
import styles from './PreConsultChatTranscript.module.css';

interface PreConsultChatTranscriptProps {
  messages: PreConsultChatMessage[];
  subjectLabel?: string;
  /** taller scroll area for dedicated chat modal */
  expanded?: boolean;
}

export function PreConsultChatTranscript({
  messages,
  subjectLabel,
  expanded = false,
}: PreConsultChatTranscriptProps) {
  return (
    <div className={`${styles.wrap} ${expanded ? styles.wrapExpanded : ""}`} dir="rtl">
      {subjectLabel ? (
        <p className={styles.subjectBadge}>موضوع: {subjectLabel}</p>
      ) : null}
      <div className={`${styles.thread} ${expanded ? styles.threadExpanded : ""}`}>
        {messages.map((msg, idx) => (
          <div
            key={`${idx}-${msg.role}`}
            className={`${styles.row} ${msg.role === 'user' ? styles.rowUser : styles.rowBot}`}
          >
            <div
              className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleBot}`}
            >
              {msg.role === 'assistant' ? (
                <div className={`${styles.text} ${styles.markdown}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className={styles.text}>{msg.content}</p>
              )}
              {msg.time ? <span className={styles.time}>{msg.time}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
