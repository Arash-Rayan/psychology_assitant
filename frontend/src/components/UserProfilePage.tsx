'use client';

import {
  User,
  BookOpen,
  Headphones,
  Film,
  CheckSquare,
  Square,
  Zap,
  Tag,
  ArrowRight,
  Settings,
  Clock,
  Star,
  TrendingUp,
  Phone,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import styles from './UserProfilePage.module.css';

/* ─── Types ─────────────────────────────────────────── */
interface Homework {
  id: string;
  text: string;
  done: boolean;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
}

interface Book {
  title: string;
  author: string;
  topic: string;
  description: string;
}

interface Podcast {
  title: string;
  host: string;
  topic: string;
  duration: string;
}

interface Film {
  title: string;
  director: string;
  topic: string;
  duration: string;
  description: string;
}

interface SessionStat {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface TherapistMessage {
  id: string;
  text: string;
  date: string;
  sessionLabel?: string;
  read: boolean;
}

/* ─── Mock data — replace with API when ready ────────── */
const PROFILE = {
  firstName: 'سارا',
  lastName: 'احمدی',
  age: 29,
  gender: 'زن',
  phone: '۰۹۱۲-۳۴۵-۶۷۸۹',
  joinedDate: '۱۴۰۳/۰۳/۱۵',
  nextSession: '۱۴۰۳/۰۴/۱۰ — ساعت ۱۶:۳۰',
  therapistName: 'دکتر مریم رضایی',
  totalTokens: 2_000_000,
  usedTokens: 480_000,
  sessionsCompleted: 8,
  discount: { active: true, percent: 20, label: 'کاربر ویژه', expiry: '۱۴۰۳/۰۶/۳۱' },
  homework: [
    { id: '1', text: 'هر شب ۱۰ دقیقه تنفس دیافراگمی تمرین کنید', done: true, dueDate: '۱۴۰۳/۰۴/۰۲', priority: 'high' },
    { id: '2', text: 'ثبت احساسات روزانه در دفترچه', done: false, dueDate: '۱۴۰۳/۰۴/۰۵', priority: 'high' },
    { id: '3', text: 'پیاده‌روی ۳۰ دقیقه‌ای سه‌بار در هفته', done: false, dueDate: '۱۴۰۳/۰۴/۰۸', priority: 'medium' },
    { id: '4', text: 'فصل اول کتاب "خودت باش" را بخوانید', done: true, dueDate: '۱۴۰۳/۰۳/۳۰', priority: 'low' },
  ] as Homework[],
  books: [
    { title: 'جادوی فکر بزرگ', author: 'دیوید جی. شوارتز', topic: 'اضطراب', description: 'راهکارهای عملی برای غلبه بر نگرانی و ساخت اعتماد به نفس' },
    { title: 'خودت باش', author: 'برنه براون', topic: 'عزت نفس', description: 'کشف شجاعت، محبت و تعلق از طریق آسیب‌پذیری' },
    { title: 'قدرت حال', author: 'اکهارت تول', topic: 'ذهن‌آگاهی', description: 'راهنمای زندگی در لحظه حال برای آرامش ذهن' },
  ] as Book[],
  podcasts: [
    { title: 'ذهن آرام', host: 'دکتر رضایی', topic: 'مدیریت استرس', duration: 'هر اپیزود ۲۵ دقیقه' },
    { title: 'گفتگوی روان', host: 'تیم روانصد', topic: 'سلامت روان', duration: 'هر اپیزود ۴۰ دقیقه' },
    { title: 'مدیتیشن فارسی', host: 'استودیو آرام', topic: 'ذهن‌آگاهی', duration: 'هر اپیزود ۱۵ دقیقه' },
  ] as Podcast[],
  films: [
    {
      title: 'یک روز عادی',
      director: 'اصغر فرهادی',
      topic: 'روابط خانوادگی',
      duration: '۱ ساعت و ۳۵ دقیقه',
      description: 'درام انسانی دربارهٔ فاصله، گفت‌وگو و بازسازی اعتماد در خانواده',
    },
    {
      title: 'Inside Out',
      director: 'پیت داکتر',
      topic: 'هیجان‌ها',
      duration: '۱ ساعت و ۳۵ دقیقه',
      description: 'نگاهی ساده و عمیق به نقش احساسات در رشد و تصمیم‌گیری',
    },
    {
      title: 'The Pursuit of Happyness',
      director: 'گبریل میتسی',
      topic: 'تاب‌آوری',
      duration: '۱ ساعت و ۵۷ دقیقه',
      description: 'داستان امید و پایداری در شرایط سخت — الهام‌بخش برای ادامهٔ مسیر درمان',
    },
  ] as Film[],
  therapistMessages: [
    {
      id: 'm1',
      text: 'سارا عزیز، ثبت احساسات در هفته گذشته قابل تقدیر بود. همین مسیر را با آرامش ادامه بده.',
      date: '۱۴۰۳/۰۴/۰۲',
      sessionLabel: 'پس از جلسه ۸',
      read: false,
    },
    {
      id: 'm2',
      text: 'قبل از جلسه بعدی، سه موقعیت استرس‌زای این هفته را یادداشت کن تا در جلسه بررسی کنیم.',
      date: '۱۴۰۳/۰۳/۲۸',
      sessionLabel: 'یادآوری',
      read: true,
    },
    {
      id: 'm3',
      text: 'اگر بین جلسات احساس سنگینی یا افکار خودآسیب‌رسان داشتی، بلافاصله با من یا خط اورژانس تماس بگیر.',
      date: '۱۴۰۳/۰۳/۲۰',
      read: true,
    },
  ] as TherapistMessage[],
};

const PRIORITY_COLORS: Record<Homework['priority'], string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};
const PRIORITY_LABELS: Record<Homework['priority'], string> = {
  high: 'مهم',
  medium: 'متوسط',
  low: 'کم',
};

/* ─── Helpers ────────────────────────────────────────── */
function TokenRing({ used, total }: { used: number; total: number }) {
  const pct = Math.min(100, ((total - used) / total) * 100);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className={styles.tokenRingWrap}>
      <svg width={130} height={130} className={styles.tokenRingSvg}>
        <circle cx={65} cy={65} r={r} className={styles.tokenTrack} />
        <circle
          cx={65} cy={65} r={r}
          className={styles.tokenProgress}
          strokeDasharray={`${dash} ${circ}`}
          transform="rotate(-90 65 65)"
        />
      </svg>
      <div className={styles.tokenRingCenter}>
        <span className={styles.tokenPct}>{Math.round(pct)}٪</span>
        <span className={styles.tokenPctLabel}>باقی‌مانده</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: SessionStat) {
  return (
    <div className={styles.statCard} style={{ '--stat-color': color } as React.CSSProperties}>
      <div className={styles.statIcon}>{icon}</div>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────── */
export function UserProfilePage() {
  const p = PROFILE;
  const initials = `${p.firstName[0]}${p.lastName[0]}`;
  const doneCount = p.homework.filter((h) => h.done).length;
  const remaining = p.totalTokens - p.usedTokens;
  const unreadMessages = p.therapistMessages.filter((m) => !m.read).length;

  const stats: SessionStat[] = [
    { label: 'جلسات کامل‌شده', value: String(p.sessionsCompleted), icon: <Star />, color: '#8b5cf6' },
    { label: 'درمانگر', value: 'دکتر رضایی', icon: <User />, color: '#06b6d4' },
    { label: 'جلسه بعدی', value: '۱۰ تیر', icon: <Calendar />, color: '#f59e0b' },
    { label: 'تکالیف باقی‌مانده', value: `${p.homework.length - doneCount}`, icon: <TrendingUp />, color: '#10b981' },
  ];

  return (
    <div className={styles.page} dir="rtl">
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <Link href="/home" className={styles.backBtn}>
            <ArrowRight className={styles.backIcon} />
            <span>بازگشت</span>
          </Link>
          <h1 className={styles.pageTitle}>پروفایل من</h1>
          <button className={styles.settingsBtn} aria-label="تنظیمات">
            <Settings className={styles.settingsIcon} />
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* ══ HERO CARD ══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={styles.heroCard}
        >
          <div className={styles.heroBg} />
          <div className={styles.heroBody}>
            <div className={styles.heroLeft}>
              <div className={styles.avatar}>{initials}</div>
              <div className={styles.heroInfo}>
                <h2 className={styles.heroName}>{p.firstName} {p.lastName}</h2>
                <p className={styles.heroMeta}>{p.age} ساله · {p.gender}</p>
                <p className={styles.heroMeta}>
                  <Phone className={styles.inlineIcon} />
                  {p.phone}
                </p>
                <p className={styles.heroMeta}>
                  <Clock className={styles.inlineIcon} />
                  عضو از {p.joinedDate}
                </p>
              </div>
            </div>
            {p.discount.active && (
              <div className={styles.heroBadge}>
                <Tag className={styles.heroBadgeIcon} />
                <span>{p.discount.percent}٪ تخفیف</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ══ STATS ROW ══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className={styles.statsRow}
        >
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </motion.div>

        {/* ══ MAIN GRID ══ */}
        <div className={styles.grid}>
          {/* ── Token card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className={`${styles.card} ${styles.tokenCard}`}
          >
            <div className={styles.cardHeader}>
              <Zap className={styles.cardHeaderIcon} />
              <h3 className={styles.cardHeaderTitle}>سهمیه گفتگو</h3>
            </div>
            <div className={styles.tokenBody}>
              <TokenRing used={p.usedTokens} total={p.totalTokens} />
              <div className={styles.tokenDetails}>
                <div className={styles.tokenDetailRow}>
                  <span className={styles.tokenDetailDot} style={{ background: '#8b5cf6' }} />
                  <span className={styles.tokenDetailLabel}>مانده</span>
                  <span className={styles.tokenDetailVal}>{remaining.toLocaleString('fa-IR')}</span>
                </div>
                <div className={styles.tokenDetailRow}>
                  <span className={styles.tokenDetailDot} style={{ background: '#e2e8f0' }} />
                  <span className={styles.tokenDetailLabel}>مصرف‌شده</span>
                  <span className={styles.tokenDetailVal}>{p.usedTokens.toLocaleString('fa-IR')}</span>
                </div>
                <div className={`${styles.tokenDetailRow} ${styles.tokenDetailTotal}`}>
                  <span className={styles.tokenDetailLabel}>کل</span>
                  <span className={styles.tokenDetailVal}>{p.totalTokens.toLocaleString('fa-IR')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Discount card ── */}
          {p.discount.active && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className={`${styles.card} ${styles.discountCard}`}
            >
              <div className={styles.discountGlow} />
              <div className={styles.discountTopRow}>
                <div className={styles.discountIconWrap}>
                  <Tag className={styles.discountBigIcon} />
                </div>
                <div className={styles.discountPct}>{p.discount.percent}٪</div>
              </div>
              <h3 className={styles.discountTitle}>{p.discount.label}</h3>
              <p className={styles.discountDesc}>
                تخفیف ویژه روی تمدید اشتراک شما اعمال می‌شود.
              </p>
              <div className={styles.discountExpiry}>
                <Clock className={styles.discountExpiryIcon} />
                <span>انقضا: {p.discount.expiry}</span>
              </div>
            </motion.div>
          )}

          {/* ── Next session ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`${styles.card} ${styles.nextSessionCard}`}
          >
            <div className={styles.cardHeader}>
              <Calendar className={styles.cardHeaderIcon} />
              <h3 className={styles.cardHeaderTitle}>جلسه بعدی</h3>
            </div>
            <p className={styles.nextSessionDate}>{p.nextSession}</p>
            <p className={styles.nextSessionTherapist}>با {p.therapistName}</p>
          </motion.div>
        </div>

        {/* ══ HOMEWORK ══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className={styles.card}
        >
          <div className={styles.cardHeader}>
            <TrendingUp className={styles.cardHeaderIcon} />
            <h3 className={styles.cardHeaderTitle}>تکالیف از درمانگر</h3>
            <span className={styles.cardBadge}>{doneCount}/{p.homework.length} انجام‌شده</span>
          </div>

          {/* Progress bar */}
          <div className={styles.hwProgress}>
            <div
              className={styles.hwProgressFill}
              style={{ width: `${(doneCount / p.homework.length) * 100}%` }}
            />
          </div>

          <ul className={styles.hwList}>
            {p.homework.map((hw) => (
              <li key={hw.id} className={`${styles.hwItem} ${hw.done ? styles.hwItemDone : ''}`}>
                <div className={styles.hwCheck}>
                  {hw.done
                    ? <CheckSquare className={`${styles.hwCheckIcon} ${styles.hwCheckDone}`} />
                    : <Square className={`${styles.hwCheckIcon} ${styles.hwCheckPending}`} />
                  }
                </div>
                <div className={styles.hwBody}>
                  <p className={`${styles.hwText} ${hw.done ? styles.hwTextDone : ''}`}>{hw.text}</p>
                  {hw.dueDate && <p className={styles.hwDue}>موعد: {hw.dueDate}</p>}
                </div>
                <span
                  className={styles.hwPriority}
                  style={{ color: PRIORITY_COLORS[hw.priority], background: `${PRIORITY_COLORS[hw.priority]}18`, borderColor: `${PRIORITY_COLORS[hw.priority]}30` }}
                >
                  {PRIORITY_LABELS[hw.priority]}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ══ THERAPIST MESSAGES ══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
          className={styles.card}
        >
          <div className={styles.cardHeader}>
            <MessageCircle className={styles.cardHeaderIcon} />
            <h3 className={styles.cardHeaderTitle}>پیام‌های درمانگر</h3>
            {unreadMessages > 0 && (
              <span className={styles.cardBadge}>{unreadMessages} جدید</span>
            )}
          </div>
          <p className={styles.sectionIntro}>
            پیام‌ها و یادآوری‌های {p.therapistName} بین جلسات
          </p>
          <ul className={styles.messageList}>
            {p.therapistMessages.map((msg) => (
              <li
                key={msg.id}
                className={`${styles.messageItem} ${!msg.read ? styles.messageItemUnread : ''}`}
              >
                <div className={styles.messageTop}>
                  <span className={styles.messageTherapist}>{p.therapistName}</span>
                  <span className={styles.messageDate}>{msg.date}</span>
                </div>
                {msg.sessionLabel && (
                  <span className={styles.messageTag}>{msg.sessionLabel}</span>
                )}
                <p className={styles.messageText}>{msg.text}</p>
                {!msg.read && <span className={styles.messageUnreadDot} aria-hidden />}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ══ RESOURCES ROW ══ */}
        <div className={styles.resourcesRow}>
          {/* Books */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            className={styles.card}
          >
            <div className={styles.cardHeader}>
              <BookOpen className={styles.cardHeaderIcon} />
              <h3 className={styles.cardHeaderTitle}>کتاب‌های پیشنهادی</h3>
            </div>
            <ul className={styles.bookList}>
              {p.books.map((book, i) => (
                <li key={i} className={styles.bookItem}>
                  <div className={styles.bookCover}>
                    <BookOpen className={styles.bookCoverIcon} />
                  </div>
                  <div className={styles.bookInfo}>
                    <p className={styles.bookTitle}>{book.title}</p>
                    <p className={styles.bookAuthor}>{book.author}</p>
                    <p className={styles.bookDesc}>{book.description}</p>
                    <span className={styles.bookTopic}>{book.topic}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Podcasts */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32 }}
            className={styles.card}
          >
            <div className={styles.cardHeader}>
              <Headphones className={styles.cardHeaderIcon} />
              <h3 className={styles.cardHeaderTitle}>پادکست‌های پیشنهادی</h3>
            </div>
            <ul className={styles.podList}>
              {p.podcasts.map((pod, i) => (
                <li key={i} className={styles.podItem}>
                  <div className={styles.podCover}>
                    <Headphones className={styles.podCoverIcon} />
                  </div>
                  <div className={styles.podInfo}>
                    <p className={styles.podTitle}>{pod.title}</p>
                    <p className={styles.podHost}>{pod.host}</p>
                    <div className={styles.podMeta}>
                      <span className={styles.podTopic}>{pod.topic}</span>
                      <span className={styles.podDuration}>{pod.duration}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Films */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.36 }}
            className={styles.card}
          >
            <div className={styles.cardHeader}>
              <Film className={styles.cardHeaderIcon} />
              <h3 className={styles.cardHeaderTitle}>فیلم‌های پیشنهادی</h3>
            </div>
            <ul className={styles.filmList}>
              {p.films.map((film, i) => (
                <li key={i} className={styles.filmItem}>
                  <div className={styles.filmCover}>
                    <Film className={styles.filmCoverIcon} />
                  </div>
                  <div className={styles.filmInfo}>
                    <p className={styles.filmTitle}>{film.title}</p>
                    <p className={styles.filmDirector}>{film.director}</p>
                    <p className={styles.filmDesc}>{film.description}</p>
                    <div className={styles.filmMeta}>
                      <span className={styles.filmTopic}>{film.topic}</span>
                      <span className={styles.filmDuration}>{film.duration}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
