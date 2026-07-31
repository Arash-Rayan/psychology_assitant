'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import {
  MessageCircle,
  LayoutDashboard,
  Mic,
  Shield,
  Stethoscope,
  HeartHandshake,
  ClipboardList,
  ArrowLeft,
  UserPlus,
  Brain,
  Heart,
  Smile,
} from 'lucide-react';
import { Logo } from './Logo';
import styles from './HomePage.module.css';

const AUDIENCES = [
  {
    icon: Stethoscope,
    title: 'درمانگران و روان‌پزشکان',
    description:
      'داشبورد بالینی، یادداشت جلسه، تحلیل هوش مصنوعی و پیگیری روند درمان در یک محیط یکپارچه.',
    href: '/signup/doctor',
    cta: 'ثبت‌نام درمانگر',
  },
  {
    icon: HeartHandshake,
    title: 'مراجعان',
    description:
      'پیش‌مشاوره هوشمند، گفتگوی امن بین جلسات و خودارزیابی‌های معتبر — با حفظ حریم خصوصی.',
    href: '/signup',
    cta: 'شروع به‌عنوان مراجع',
  },
  {
    icon: ClipboardList,
    title: 'منشی و کلینیک',
    description:
      'هماهنگی مراجعان، برنامه‌ریزی جلسات و اتصال امن به پرونده پزشک با کد معرف.',
    href: '/signup/secretary',
    cta: 'ثبت‌نام منشی',
  },
];

const STEPS = [
  {
    step: '۱',
    title: 'ورود یا پیش‌مشاوره',
    description: 'مراجع جدید از چت پیش‌مشاوره شروع می‌کند؛ درمانگر پرونده را در داشبورد می‌بیند.',
  },
  {
    step: '۲',
    title: 'جلسه و ثبت بالینی',
    description: 'یادداشت ساختارمند، ضبط صوت و تبدیل به متن فارسی، فرم‌ها و آزمون‌های روان‌شناختی.',
  },
  {
    step: '۳',
    title: 'تحلیل چندعاملی',
    description: 'هوش مصنوعی هیجان، طرحواره، ریسک و الگوهای شناختی را از متن استخراج می‌کند.',
  },
  {
    step: '۴',
    title: 'پیگیری و مداخله',
    description: 'نمودار روند، هشدار فوری و خلاصه چندجلسه‌ای برای تصمیم‌گیری دقیق‌تر درمانگر.',
  },
];

const CAPABILITIES = [
  {
    icon: LayoutDashboard,
    title: 'داشبورد یکپارچه',
    description: 'پرونده‌ها، ریسک، جلسات و روند امتیاز در یک نگاه.',
  },
  {
    icon: Mic,
    title: 'یادداشت صوتی جلسه',
    description: 'ضبط مستقیم یا بارگذاری فایل و تبدیل خودکار به متن فارسی.',
  },
  {
    icon: MessageCircle,
    title: 'چت پیش‌مشاوره و بین جلسات',
    description: 'آماده‌سازی قبل از ویزیت و همراهی همدل بین جلسات درمانی.',
  },
  {
    icon: Shield,
    title: 'محرمانگی حرفه‌ای',
    description: 'طراحی با اولویت حریم خصوصی مطابق اصول اخلاق حرفه‌ای.',
  },
];

export function HomePage() {
  return (
    <div className={styles.container} dir="rtl">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.heroSection}
      >
        <div className={styles.heroContent}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className={styles.brandMark}
              >
                روانصد
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className={styles.title}
              >
                همراه شما در مسیر
                <span className={styles.titlePrimary}> سلامت روان</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className={styles.description}
              >
                پلتفرم حرفه‌ای برای درمانگر و مراجع — از پیش‌مشاوره و یادداشت جلسه تا
                تحلیل هوش مصنوعی، در یک محیط امن و فارسی‌زبان.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className={styles.buttonGroup}
              >
                <Link href="/chat" className={styles.primaryButton}>
                  <MessageCircle />
                  <span>شروع گفتگو با روانصد</span>
                </Link>
                <Link href="/auth" className={styles.secondaryButton}>
                  <UserPlus />
                  <span>ورود / ثبت‌نام</span>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className={styles.illustrationContainer}
            >
              <div className={styles.illustrationBg} />
              <div className={styles.illustrationCard}>
                <div className={styles.illustrationContent}>
                  <div className={styles.circleGroup}>
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], y: [0, -4, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      className={`${styles.circle} ${styles.circlePrimary}`}
                    >
                      <Brain />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], y: [0, -4, 0] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.35,
                      }}
                      className={`${styles.circle} ${styles.circleSecondary}`}
                    >
                      <Heart />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], y: [0, -4, 0] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.7,
                      }}
                      className={`${styles.circle} ${styles.circleAccent}`}
                    >
                      <Smile />
                    </motion.div>
                  </div>

                  <div className={styles.connectionContainer}>
                    <div className={styles.connectionCircle}>
                      <motion.div
                        className={styles.glowRing}
                        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.65, 0.35] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        aria-hidden
                      />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                        className={styles.rotatingBorder}
                        aria-hidden
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                        className={styles.rotatingBorderOuter}
                        aria-hidden
                      />
                      <motion.div
                        className={styles.innerCircle}
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <span className={styles.logoAura} aria-hidden />
                        <Logo size="featured" priority className={styles.innerCircleLogo} />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.sectionTitle}>برای چه کسانی ساخته شده؟</h2>
            <p className={styles.sectionSubtitle}>
              روانصد مسیر درمان را برای کلینیک، درمانگر و مراجع هم‌راستا می‌کند.
            </p>
          </motion.div>

          <div className={styles.audienceList}>
            {AUDIENCES.map((item, index) => (
              <motion.div
                key={item.title}
                className={styles.audienceRow}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
              >
                <div className={styles.audienceIcon}>
                  <item.icon />
                </div>
                <div className={styles.audienceBody}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <Link href={item.href} className={styles.audienceLink}>
                  <span>{item.cta}</span>
                  <ArrowLeft size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionSoft}`}>
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.sectionTitle}>مسیر کار با روانصد</h2>
            <p className={styles.sectionSubtitle}>
              از اولین تماس تا پیگیری بلندمدت درمان — چهار گام شفاف.
            </p>
          </motion.div>

          <ol className={styles.stepsList}>
            {STEPS.map((item, index) => (
              <motion.li
                key={item.title}
                className={styles.stepItem}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.07, duration: 0.4 }}
              >
                <span className={styles.stepNumber}>{item.step}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.sectionTitle}>آنچه در عمل دریافت می‌کنید</h2>
            <p className={styles.sectionSubtitle}>
              ابزارهای بالینی واقعی — نه فقط یک چت‌بات عمومی.
            </p>
          </motion.div>

          <div className={styles.capabilityGrid}>
            {CAPABILITIES.map((item, index) => (
              <motion.article
                key={item.title}
                className={styles.capabilityItem}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
              >
                <item.icon className={styles.capabilityIcon} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.article>
            ))}
          </div>

          <div className={styles.aboutLinkWrap}>
            <Link href="/about" className={styles.textLink}>
              جزئیات کامل امکانات در صفحه درباره ما
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.trustSection}>
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.trustBlock}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <Shield className={styles.trustIcon} />
            <h2 className={styles.sectionTitle}>امنیت و اخلاق حرفه‌ای در مرکز طراحی</h2>
            <p className={styles.sectionSubtitle}>
              داده‌های بالینی فقط در چارچوب درمان مدیریت می‌شوند. هدف روانصد تقویت قضاوت حرفه‌ای
              درمانگر است — نه جایگزینی رابطه درمانی.
            </p>
          </motion.div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <motion.div
            className={styles.ctaPanel}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.ctaTitle}>آماده شروع مسیر درمان با روانصد هستید؟</h2>
            <p className={styles.ctaDescription}>
              گفتگو را همین حالا آغاز کنید یا حساب متناسب با نقش خود بسازید.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/chat" className={styles.ctaButton}>
                <MessageCircle />
                <span>شروع گفتگو</span>
              </Link>
              <Link href="/signup" className={styles.ctaButtonGhost}>
                <span>ایجاد حساب</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
