"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { JOURNAL_TOPICS, MOCK_CHAT } from "@/lib/constants";
import type { ChatMessage } from "@/lib/types";
import styles from "./journal.module.css";

export default function JournalPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState(JOURNAL_TOPICS[0].id);

  function send() {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: input.trim() };
    const replies: Record<string, string> = {
      stress: "می‌فهمم اضطراب امتحان سنگین است. پیشنهاد: ۱۰ دقیقه breathwork قبل از مطالعه. podcast «Anxiety Toolkit» را در insights ببین. آیا می‌خواهی فردا فقط ۵ task بگذاری؟",
      interests: "علاقه‌ات به فلسفه و موسیقی جالب است — Lo-fi + متون استوایی برای تمرکز خوبند. کتاب «مدیتیشن و ذهن» Sam Harris را پیشنهاد می‌کنم.",
      plans: "هدف هفته: فصل ۴ آمار. مانع: overcommitment. پیشنهاد: حداکثر ۵ task/روز تا جمعه.",
      mood: "انرژی صبح بالاتر بود — ۸۸٪ بهره‌وری ۸–۱۰. عصر را سبک‌تر بگذار.",
    };
    const aiMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: replies[topic] ?? "ممنون که به اشتراک گذاشتی. بر اساس planner و journalت پیشنهاد می‌دهم...",
    };
    setMessages((p) => [...p, userMsg, aiMsg]);
    setInput("");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>گفتگو با AI</h1>
        <p>درباره استرس، اضطراب، موسیقی، فلسفه، برنامه، یا هر چیز دیگر</p>
      </header>

      <div className={styles.topics}>
        {JOURNAL_TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={topic === t.id ? styles.topicOn : styles.topic}
            onClick={() => setTopic(t.id)}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <div className={`${styles.chat} glass`}>
        <div className={styles.messages}>
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? styles.user : styles.assistant}>
              {m.role === "assistant" && <div className={styles.orb} />}
              <p>{m.content}</p>
            </div>
          ))}
        </div>
        <div className={styles.inputRow}>
          <input
            placeholder={JOURNAL_TOPICS.find((t) => t.id === topic)?.prompt}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button type="button" onClick={send} className={styles.send}>
            <Send size={18} />
          </button>
        </div>
      </div>

      <p className={styles.disclaimer}>
        این AI مربی زندگی است — جایگزین درمان یا مشاوره روانصد نیست. در بحران به خطوط کمک مراجعه کن.
      </p>
    </div>
  );
}
