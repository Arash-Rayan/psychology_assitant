"use client";

import { motion } from "motion/react";
import { X, Sparkles, ClipboardList, BarChart3, Phone, MessageCircle } from "lucide-react";
import type { PatientDetail } from "./PatientDetailView";
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
  const { chatbotSummary, assessments } = patient;
  const neo = assessments.neo;

  const panel = (
    <motion.div
      initial={{ opacity: embedded ? 1 : 0, scale: embedded ? 1 : 0.94, y: embedded ? 0 : 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 16 }}
      onClick={embedded ? undefined : (e) => e.stopPropagation()}
      className={`${detailStyles.modal} ${styles.modalNarrow} ${embedded ? styles.embeddedPanel : ''}`}
      dir="rtl"
    >
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <div className={styles.headerIcon}>
              <Sparkles />
            </div>
            <div>
              <span className={styles.eyebrow}>مراجع جدید — بدون پرونده کامل</span>
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
            این مراجع تازه‌وار است؛ فقط خلاصهٔ گفت‌وگوی غربالگری با چت‌بات و نمرات
            آزمون‌های ورودی را می‌بینید. یادداشت جلسات و تحلیل گستردهٔ هوش مصنوعی پس از
            فعال‌شدن پروندهٔ درمانی در لیست مراجعین در دسترس است.
          </p>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <MessageCircle className={styles.sectionIcon} aria-hidden />
              خلاصهٔ گفت‌وگو با چت‌بات (نمونه)
            </h3>
            <div className={styles.conversationCard}>
              <p className={styles.conversationLead}>
                {patient.intakeConversationSummary ??
                  'در گفت‌وگوی غربالگری، مراجع به طور خلاصه زمینهٔ مراجعه، شدت علائم اخیر و انتظارات خود از درمان را بیان کرده است. جزئیات کامل پرونده پس از تکمیل ارزیابی بالینی باز می‌شود.'}
              </p>
              {(patient.intakeChatHighlights?.length ?? 0) > 0 && (
                <>
                  <p className={styles.highlightsLabel}>نکات استخراج‌شده از مکالمه:</p>
                  <ul className={styles.highlightsList}>
                    {patient.intakeChatHighlights!.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <ClipboardList className={styles.sectionIcon} aria-hidden />
              خلاصهٔ بالینی اولیه (چت‌بات)
            </h3>
            <div className={styles.chatCard}>
              <div className={styles.topicRow}>
                <span className={styles.topicLabel}>موضوع غالب</span>
                <span className={styles.topicValue}>{chatbotSummary.mainTopic}</span>
              </div>
              <div className={styles.topicRow}>
                <span className={styles.topicLabel}>اطمینان مدل</span>
                <span className={styles.topicValue}>
                  {chatbotSummary.confidence}٪
                </span>
              </div>
              <p className={styles.notes}>{chatbotSummary.notes}</p>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <BarChart3 className={styles.sectionIcon} aria-hidden />
              نمرات آزمون‌های ورودی
            </h3>
            <div className={styles.scoreGrid}>
              <div className={styles.scoreCard}>
                <span className={styles.scoreLabel}>افسردگی (غربالگری)</span>
                <span className={styles.scoreValue}>{assessments.depression}</span>
              </div>
              <div className={styles.scoreCard}>
                <span className={styles.scoreLabel}>اضطراب</span>
                <span className={styles.scoreValue}>{assessments.anxiety}</span>
              </div>
              <div className={styles.scoreCard}>
                <span className={styles.scoreLabel}>استرس</span>
                <span className={styles.scoreValue}>{assessments.stress}</span>
              </div>
            </div>

            <h4 className={styles.neoTitle}>پروفایل NEO (ورودی)</h4>
            <ul className={styles.neoList}>
              <li>
                <span>روان‌رنج‌خوئی</span>
                <span>{neo.neuroticism}</span>
              </li>
              <li>
                <span>برون‌گرایی</span>
                <span>{neo.extraversion}</span>
              </li>
              <li>
                <span>گشودگی به تجربه</span>
                <span>{neo.openness}</span>
              </li>
              <li>
                <span>توافق‌پذیری</span>
                <span>{neo.agreeableness}</span>
              </li>
              <li>
                <span>وظیفه‌شناسی</span>
                <span>{neo.conscientiousness}</span>
              </li>
            </ul>
          </section>
        </div>
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
