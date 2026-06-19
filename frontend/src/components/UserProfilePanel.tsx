'use client';

import { X, User, BookOpen, Headphones, CheckSquare, Square, Zap, Tag, ChevronLeft, MessageCircle, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './UserProfilePanel.module.css';

interface Homework {
  id: string;
  text: string;
  done: boolean;
  dueDate?: string;
}

interface Book {
  title: string;
  author: string;
  topic: string;
}

interface Podcast {
  title: string;
  host: string;
  topic: string;
}

interface TherapistMessage {
  id: string;
  text: string;
  date: string;
  read: boolean;
}

interface SessionFeedback {
  id: string;
  sessionNumber: number;
  date: string;
  summary: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  joinedDate: string;
  totalTokens: number;
  usedTokens: number;
  discount: { active: boolean; percent: number; label: string } | null;
  homework: Homework[];
  books: Book[];
  podcasts: Podcast[];
  therapistMessages: TherapistMessage[];
  sessionFeedback: SessionFeedback[];
  therapistName: string;
}

// Placeholder data — replace with real API call when backend is ready
const MOCK_PROFILE: UserProfile = {
  firstName: 'سارا',
  lastName: 'احمدی',
  age: 29,
  gender: 'زن',
  joinedDate: '۱۴۰۳/۰۳/۱۵',
  totalTokens: 2_000_000,
  usedTokens: 480_000,
  discount: { active: true, percent: 20, label: 'کاربر ویژه' },
  homework: [
    { id: '1', text: 'هر شب ۱۰ دقیقه تنفس دیافراگمی', done: true, dueDate: '۱۴۰۳/۰۴/۰۲' },
    { id: '2', text: 'ثبت احساسات روزانه در دفترچه', done: false, dueDate: '۱۴۰۳/۰۴/۰۵' },
    { id: '3', text: 'پیاده‌روی ۳۰ دقیقه‌ای سه‌بار در هفته', done: false, dueDate: '۱۴۰۳/۰۴/۰۸' },
  ],
  books: [
    { title: 'جادوی فکر بزرگ', author: 'دیوید جی. شوارتز', topic: 'اضطراب' },
    { title: 'خودت باش', author: 'برنه براون', topic: 'عزت نفس' },
  ],
  podcasts: [
    { title: 'ذهن آرام', host: 'دکتر رضایی', topic: 'مدیریت استرس' },
    { title: 'گفتگوی روان', host: 'تیم روانصد', topic: 'سلامت روان' },
  ],
  therapistName: 'دکتر مریم رضایی',
  therapistMessages: [
    {
      id: 'm1',
      text: 'ثبت احساسات در هفته گذشته قابل تقدیر بود. همین مسیر را ادامه بده.',
      date: '۱۴۰۳/۰۴/۰۲',
      read: false,
    },
    {
      id: 'm2',
      text: 'سه موقعیت استرس‌زای این هفته را یادداشت کن.',
      date: '۱۴۰۳/۰۳/۲۸',
      read: true,
    },
  ],
  sessionFeedback: [
    {
      id: 'f1',
      sessionNumber: 8,
      date: '۱۴۰۳/۰۴/۰۱',
      summary: 'روی شناسایی افکار خودکار قبل از واکنش‌های هیجانی کار کردیم.',
    },
  ],
};

interface UserProfilePanelProps {
  open: boolean;
  onClose: () => void;
}

function TokenBar({ used, total }: { used: number; total: number }) {
  const pct = Math.min(100, (used / total) * 100);
  const remaining = total - used;
  const remainingPct = 100 - pct;

  return (
    <div className={styles.tokenSection}>
      <div className={styles.tokenHeader}>
        <div className={styles.tokenLabelGroup}>
          <Zap className={styles.tokenIcon} />
          <span className={styles.tokenLabel}>توکن‌های گفتگو</span>
        </div>
        <span className={styles.tokenRemaining}>
          {remaining.toLocaleString('fa-IR')} مانده
        </span>
      </div>
      <div className={styles.tokenBar}>
        <div
          className={styles.tokenBarFill}
          style={{ width: `${remainingPct}%` }}
        />
      </div>
      <div className={styles.tokenStats}>
        <span className={styles.tokenUsed}>
          مصرف‌شده: {used.toLocaleString('fa-IR')}
        </span>
        <span className={styles.tokenTotal}>
          کل: {total.toLocaleString('fa-IR')}
        </span>
      </div>
    </div>
  );
}

export function UserProfilePanel({ open, onClose }: UserProfilePanelProps) {
  const p = MOCK_PROFILE;
  const initials = `${p.firstName[0]}${p.lastName[0]}`;
  const doneCount = p.homework.filter((h) => h.done).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            className={styles.panel}
            dir="rtl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          >
            {/* Panel header */}
            <div className={styles.panelHeader}>
              <button className={styles.closeBtn} onClick={onClose} aria-label="بستن پروفایل">
                <ChevronLeft className={styles.closeBtnIcon} />
              </button>
              <h2 className={styles.panelTitle}>پروفایل من</h2>
            </div>

            <div className={styles.scrollArea}>
              {/* Avatar + name */}
              <div className={styles.avatarSection}>
                <div className={styles.avatar}>{initials}</div>
                <div className={styles.avatarInfo}>
                  <p className={styles.fullName}>{p.firstName} {p.lastName}</p>
                  <p className={styles.metaLine}>{p.age} ساله · {p.gender}</p>
                  <p className={styles.metaLine}>عضو از {p.joinedDate}</p>
                </div>
                {p.discount?.active && (
                  <div className={styles.discountBadge}>
                    <Tag className={styles.discountIcon} />
                    <span>{p.discount.percent}٪ تخفیف</span>
                  </div>
                )}
              </div>

              {/* Token bar */}
              <div className={styles.card}>
                <TokenBar used={p.usedTokens} total={p.totalTokens} />
              </div>

              {/* Discount detail */}
              {p.discount?.active && (
                <div className={`${styles.card} ${styles.discountCard}`}>
                  <div className={styles.discountCardRow}>
                    <Tag className={styles.discountCardIcon} />
                    <div>
                      <p className={styles.discountCardTitle}>تخفیف فعال: {p.discount.label}</p>
                      <p className={styles.discountCardDesc}>
                        {p.discount.percent}٪ تخفیف روی تمدید اشتراک شما اعمال می‌شود.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Homework */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <User className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>تکالیف از درمانگر</h3>
                  <span className={styles.cardBadge}>{doneCount}/{p.homework.length}</span>
                </div>
                <ul className={styles.homeworkList}>
                  {p.homework.map((hw) => (
                    <li key={hw.id} className={styles.homeworkItem}>
                      {hw.done ? (
                        <CheckSquare className={`${styles.hwIcon} ${styles.hwIconDone}`} />
                      ) : (
                        <Square className={`${styles.hwIcon} ${styles.hwIconPending}`} />
                      )}
                      <div className={styles.hwBody}>
                        <p className={`${styles.hwText} ${hw.done ? styles.hwTextDone : ''}`}>
                          {hw.text}
                        </p>
                        {hw.dueDate && (
                          <p className={styles.hwDue}>موعد: {hw.dueDate}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Therapist messages */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <MessageCircle className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>پیام‌های درمانگر</h3>
                  {p.therapistMessages.some((m) => !m.read) && (
                    <span className={styles.cardBadge}>جدید</span>
                  )}
                </div>
                <ul className={styles.messageList}>
                  {p.therapistMessages.map((msg) => (
                    <li
                      key={msg.id}
                      className={`${styles.messageItem} ${!msg.read ? styles.messageItemUnread : ''}`}
                    >
                      <div className={styles.messageMeta}>
                        <span>{p.therapistName}</span>
                        <span>{msg.date}</span>
                      </div>
                      <p className={styles.messageText}>{msg.text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Session feedback */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <ClipboardCheck className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>بازخورد جلسات</h3>
                </div>
                <ul className={styles.feedbackList}>
                  {p.sessionFeedback.map((fb) => (
                    <li key={fb.id} className={styles.feedbackItem}>
                      <div className={styles.feedbackMeta}>
                        <span>جلسه {fb.sessionNumber.toLocaleString('fa-IR')}</span>
                        <span>{fb.date}</span>
                      </div>
                      <p className={styles.feedbackText}>{fb.summary}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Books */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <BookOpen className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>کتاب‌های پیشنهادی</h3>
                </div>
                <ul className={styles.resourceList}>
                  {p.books.map((book, i) => (
                    <li key={i} className={styles.resourceItem}>
                      <div className={`${styles.resourceDot} ${styles.bookDot}`} />
                      <div>
                        <p className={styles.resourceTitle}>{book.title}</p>
                        <p className={styles.resourceMeta}>{book.author} · {book.topic}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Podcasts */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <Headphones className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>پادکست‌های پیشنهادی</h3>
                </div>
                <ul className={styles.resourceList}>
                  {p.podcasts.map((pod, i) => (
                    <li key={i} className={styles.resourceItem}>
                      <div className={`${styles.resourceDot} ${styles.podDot}`} />
                      <div>
                        <p className={styles.resourceTitle}>{pod.title}</p>
                        <p className={styles.resourceMeta}>{pod.host} · {pod.topic}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
