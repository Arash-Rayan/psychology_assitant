"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Phone, FileText, MessagesSquare } from "lucide-react";
import type { PatientDetail } from "./PatientDetailView";
import { PreConsultChatTranscript } from "./PreConsultChatTranscript";
import type { PreConsultChatMessage } from "@/constants/demoPreConsultCouplesChat";
import detailStyles from "./PatientDetailView.module.css";
import styles from "./NewIntakePatientView.module.css";

interface NewIntakePatientViewProps {
  patient: PatientDetail;
  onClose: () => void;
  /** بدون لایهٔ تمام‌صفحه؛ برای مسیر اختصاصی هر مراجع جدید */
  embedded?: boolean;
}

export function NewIntakePatientView({
  patient,
  onClose,
  embedded = false,
}: NewIntakePatientViewProps) {
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [liveMessages, setLiveMessages] = useState<PreConsultChatMessage[] | null>(null);

  useEffect(() => {
    if (patient.intakeChatMessages?.length) {
      setLiveMessages(null);
      return;
    }
    if (patient.preConsultSessionId == null) return;

    const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(/\/$/, "");
    let cancelled = false;

    async function loadSession() {
      try {
        const res = await fetch(
          `${base}/chat/pre-consult/session/${patient.preConsultSessionId}`,
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          messages: Array<{ role: string; content: string; created_at: string }>;
        };
        if (cancelled) return;
        const mapped: PreConsultChatMessage[] = data.messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content.replace(/^\[موضوع پیش‌مشاوره:[^\]]+\]\s*/u, "").trim(),
            time: m.created_at
              ? new Date(m.created_at).toLocaleTimeString("fa-IR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined,
          }));
        setLiveMessages(mapped);
      } catch {
        /* demo / offline */
      }
    }

    void loadSession();
    return () => {
      cancelled = true;
    };
  }, [patient.intakeChatMessages, patient.preConsultSessionId]);

  const chatMessages = patient.intakeChatMessages ?? liveMessages ?? [];
  const hasChatDetail = chatMessages.length > 0;

  const chatModal = (
    <AnimatePresence>
      {chatModalOpen ? (
        <motion.div
          key="chat-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.chatModalOverlay}
          onClick={() => setChatModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className={styles.chatModal}
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            <header className={styles.chatModalHeader}>
              <div>
                <h3 className={styles.chatModalTitle}>گفت‌وگوی پیش‌مشاوره</h3>
                <p className={styles.chatModalSubtitle}>
                  {patient.name}
                  {patient.preConsultSubject ? ` · ${patient.preConsultSubject}` : ""}
                </p>
              </div>
              <button
                type="button"
                className={styles.chatModalClose}
                onClick={() => setChatModalOpen(false)}
                aria-label="بستن گفت‌وگو"
              >
                <X />
              </button>
            </header>

            <div className={styles.chatModalBody}>
              {hasChatDetail ? (
                <PreConsultChatTranscript
                  messages={chatMessages}
                  subjectLabel={patient.preConsultSubject}
                  expanded
                />
              ) : (
                <div className={styles.chatEmpty}>
                  <p>گفت‌وگوی کامل برای این مراجع هنوز بارگذاری نشده است.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  const panel = (
    <motion.div
      initial={{ opacity: embedded ? 1 : 0, scale: embedded ? 1 : 0.94, y: embedded ? 0 : 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 16 }}
      onClick={embedded ? undefined : (e) => e.stopPropagation()}
      className={`${detailStyles.modal} ${styles.modalNarrow} ${embedded ? styles.embeddedPanel : ""}`}
      dir="rtl"
    >
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <div className={styles.headerIcon}>
            <Sparkles />
          </div>
          <div>
            <span className={styles.eyebrow}>مراجع جدید — پیش‌مشاوره</span>
            <h2 className={styles.title}>{patient.name}</h2>
            <div className={styles.meta}>
              <span>{patient.age} ساله</span>
              <span>•</span>
              <span>{patient.gender}</span>
              <span>•</span>
              <span className={styles.phone}>
                <Phone className={styles.phoneIcon} aria-hidden />
                {patient.phone}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="بستن"
        >
          <X />
        </button>
      </header>

      <div className={styles.body}>
        <p className={styles.intro}>
          خلاصهٔ گفت‌وگوی پیش‌مشاوره را بخوانید. برای دیدن پیام‌های کامل در پنجرهٔ
          جداگانه، دکمهٔ زیر را بزنید.
        </p>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <FileText className={styles.sectionIcon} aria-hidden />
            خلاصهٔ گفت‌وگوی پیش‌مشاوره
            {patient.preConsultSubject ? ` (${patient.preConsultSubject})` : ""}
          </h3>

          <div className={styles.conversationCard}>
            <p className={styles.conversationLead}>
              {patient.intakeConversationSummary ??
                patient.chatbotSummary.notes ??
                "خلاصهٔ گفت‌وگو هنوز ثبت نشده است."}
            </p>

            {(patient.intakeChatHighlights?.length ?? 0) > 0 && (
              <>
                <p className={styles.highlightsLabel}>نکات مهم:</p>
                <ul className={styles.highlightsList}>
                  {patient.intakeChatHighlights!.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <button
            type="button"
            className={styles.viewChatBtn}
            onClick={() => setChatModalOpen(true)}
          >
            <MessagesSquare className={styles.viewChatBtnIcon} aria-hidden />
            مشاهدهٔ گفت‌وگوی کامل (کاربر و ربات)
          </button>
        </section>
      </div>

      {chatModal}
    </motion.div>
  );

  if (embedded) {
    return (
      <div className={styles.embeddedWrap} dir="rtl">
        <button type="button" className={styles.embeddedBack} onClick={onClose}>
          بازگشت به لیست مراجعین
        </button>
        {panel}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={detailStyles.overlay}
      onClick={onClose}
    >
      {panel}
    </motion.div>
  );
}
