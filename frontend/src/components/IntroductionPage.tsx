'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import {
  Sparkles,
  Target,
  Brain,
  HeartHandshake,
  Users,
  Stethoscope,
  Camera,
  Send,
  CheckCircle2,
  Wallet,
  MessageSquareHeart,
  Crown,
  Microscope,
  LineChart,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';
import { TEAM_MEMBERS, type TeamMember } from '@/constants/teamMembers';
import { Logo } from './Logo';
import styles from './IntroductionPage.module.css';

interface PreRegisterForm {
  fullName: string;
  phone: string;
  email: string;
  specialty: string;
  experienceYears: string;
  city: string;
  message: string;
}

const EMPTY_FORM: PreRegisterForm = {
  fullName: '',
  phone: '',
  email: '',
  specialty: '',
  experienceYears: '',
  city: '',
  message: '',
};

function TeamPhoto({ name, imageSrc, accent }: { name: string; imageSrc?: string; accent: string }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !imageSrc || failed;

  return (
    <motion.div
      className={styles.teamPhotoWrap}
      style={{ '--accent': accent } as React.CSSProperties}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {showPlaceholder ? (
        <div className={styles.teamPhotoPlaceholder}>
          <motion.div
            className={styles.photoPlaceholderIcon}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Camera />
          </motion.div>
          <span className={styles.photoPlaceholderLabel}>تصویر به‌زودی</span>
          <span className={styles.photoPlaceholderName}>{name.split(' ').slice(-1)[0]}</span>
        </div>
      ) : (
        <Image
          src={imageSrc}
          alt={name}
          fill
          className={styles.teamPhotoImg}
          sizes="(max-width: 768px) 100vw, 280px"
          onError={() => setFailed(true)}
        />
      )}
    </motion.div>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <motion.article
      className={styles.teamCard}
      style={{ '--accent': member.accent } as React.CSSProperties}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4 }}
    >
      <TeamPhoto name={member.name} imageSrc={member.imageSrc} accent={member.accent} />
      <div className={styles.teamBody}>
        <h3>{member.name}</h3>
        <p className={styles.teamRole}>{member.role}</p>
        <p className={styles.teamBio}>{member.bio}</p>
      </div>
    </motion.article>
  );
}

type IntroductionPageProps = {
  /** When true, skip standalone hero (used inside combined درباره ما). */
  omitHero?: boolean;
};

export function IntroductionPage({ omitHero = false }: IntroductionPageProps) {
  const [form, setForm] = useState<PreRegisterForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof PreRegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim()) {
      toast.error('لطفاً نام، تلفن و ایمیل را وارد کنید.');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    toast.success('پیش‌ثبت‌نام شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.');
    setForm(EMPTY_FORM);
  };

  return (
    <motion.div
      className={omitHero ? styles.embedded : styles.page}
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!omitHero ? (
        <section className={styles.hero}>
          <motion.div
            className={styles.heroInner}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className={styles.heroCopy}>
              <span className={styles.badge}>
                <Sparkles />
                معرفی روانصد
              </span>
              <h1 className={styles.heroTitle}>
                پلتفرم هوشمند
                <span className={styles.heroAccent}> سلامت روان</span>
                <br />
                برای درمانگران و مراجعان فارسی‌زبان
              </h1>
              <p className={styles.heroLead}>
                روانصد ترکیبی از علم روانشناسی، تجربه بالینی و هوش مصنوعی است تا درمانگران
                بتوانند روند درمان را دقیق‌تر ببینند، ریسک را زودتر تشخیص دهند و زمان بیشتری
                برای رابطه انسانی با مراجع داشته باشند.
              </p>
              <motion.div
                className={styles.heroActions}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <a href="#pre-register" className={styles.primaryBtn}>
                  <Stethoscope />
                  پیش‌ثبت‌نام درمانگران
                </a>
                <a href="#team" className={styles.secondaryBtn}>
                  <Users />
                  تیم ما
                </a>
              </motion.div>
            </div>

            <motion.div
              className={styles.heroVisual}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Logo size="hero" priority />
              </motion.div>
              <div className={styles.heroStatCards}>
                <motion.div className={styles.heroStatCard}>
                  <Microscope />
                  <strong>تحلیل بالینی</strong>
                  <span>طرحواره، هیجان، ریسک</span>
                </motion.div>
                <motion.div
                  className={styles.heroStatCard}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <LineChart />
                  <strong>ردیابی روند</strong>
                  <span>نمودار و داشبورد</span>
                </motion.div>
                <motion.div
                  className={styles.heroStatCard}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Shield />
                  <strong>محرمانگی</strong>
                  <span>استانداردهای حرفه‌ای</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      ) : null}

      <section className={styles.section}>
        <motion.div
          className={styles.sectionInner}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>هدف ما</span>
            <h2>چرا روانصد را ساختیم؟</h2>
            <p>
              ما باور داریم فناوری باید در خدمت انسان باشد — نه جایگزین قضاوت بالینی و
              همدلی درمانگر. روانصد برای پر کردن شکاف بین داده‌های پراکنده جلسات و تصویر
              یکپارچه‌ای ساخته شده که به تصمیم‌گیری بهتر کمک می‌کند.
            </p>
          </div>

          <motion.div
            className={styles.purposeGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {[
              {
                icon: Target,
                title: 'ماموریت',
                text: 'توانمندسازی درمانگران فارسی‌زبان با ابزار داده‌محور، شفاف و ایمن برای مراقبت بهتر از مراجعان.',
              },
              {
                icon: Brain,
                title: 'آنچه انجام می‌دهیم',
                text: 'تحلیل هوشمند گفتگو و یادداشت جلسات، شناسایی الگوهای هیجانی و طرحواره‌ای، و ارائه داشبورد یکپارچه.',
              },
              {
                icon: HeartHandshake,
                title: 'ارزش‌های ما',
                text: 'انسانی ماندن درمان، احترام به حریم خصوصی، و همکاری نزدیک میان متخصصان روانشناسی و مهندسان.',
              },
            ].map(({ icon: Icon, title, text }) => (
              <motion.div
                key={title}
                className={styles.purposeCard}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <motion.div
                  className={styles.purposeIcon}
                  whileHover={{ rotate: 5, scale: 1.05 }}
                >
                  <Icon />
                </motion.div>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section id="team" className={styles.sectionAlt}>
        <motion.div
          className={styles.sectionInner}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className={`${styles.sectionHead} ${styles.teamSectionHead}`}>
            <span className={styles.sectionEyebrow}>تیم و اعضای هیئت مدیره</span>
            <h2 className={styles.teamTrustTitle}>
              افرادی که{' '}
              <span className={styles.trustHighlight}>به آن‌ها اعتماد می‌کنید</span>
            </h2>
            <p className={styles.teamSectionLead}>
              تیم و اعضای هیئت مدیره روانصد — هر کدام در حوزه تخصص خود، پشت کیفیت،
              اعتبار و مسیر درست این پلتفرم ایستاده‌اند.
            </p>
          </div>

          <motion.div
            className={styles.teamGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {TEAM_MEMBERS.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section id="pre-register" className={styles.section}>
        <motion.div
          className={styles.sectionInner}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className={styles.registerLayout}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className={styles.registerIntro}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className={styles.sectionEyebrow}>پیش‌ثبت‌نام</span>
              <h2>درمانگر هستید؟ به شبکه روانصد بپیوندید</h2>
              <p>
                اگر روانشناس، روان‌درمانگر یا مشاور هستید، با پیش‌ثبت‌نام جزو اولین
                درمانگرانی می‌شوید که به ما اعتماد کرده‌اند و از مزایای ویژه زیر
                بهره‌مند می‌شوید.
              </p>
              <ul className={styles.registerBenefits}>
                <li>
                  <Wallet />
                  <span>
                    <strong>۳ میلیون تومان اعتبار رایگان</strong> در کیف پول شما برای
                    تست و استفاده از امکانات پلتفرم
                  </span>
                </li>
                <li>
                  <MessageSquareHeart />
                  <span>
                    <strong>ایده و بازخورد شما اجرا می‌شود</strong> — حتی پیشنهادهایی که
                    فقط به سبک کار یا کلینیک شما می‌خورد؛ تیم ما بازخورد شما را در
                    اولویت توسعه قرار می‌دهد
                  </span>
                </li>
                <li>
                  <Crown />
                  <span>
                    <strong>وضعیت VIP</strong> برای کسانی که اول به ما اعتماد کردند؛
                    تخفیف‌های دوره‌ای و مزایای اختصاصی در طول زمان
                  </span>
                </li>
                <li>
                  <CheckCircle2 />
                  <span>دسترسی زودهنگام به داشبورد درمانگر و تحلیل هوشمند جلسات</span>
                </li>
              </ul>
            </motion.div>

            <motion.form
              className={styles.registerForm}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div
                className={styles.formRow}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <label className={styles.field}>
                  <span>نام و نام خانوادگی *</span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    placeholder="مثال: دکتر سارا احمدی"
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span>شماره تماس *</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                    dir="ltr"
                    required
                  />
                </label>
              </motion.div>

              <div className={styles.formRow}>
                <label className={styles.field}>
                  <span>ایمیل *</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span>تخصص / رویکرد درمانی</span>
                  <input
                    type="text"
                    value={form.specialty}
                    onChange={(e) => update('specialty', e.target.value)}
                    placeholder="مثال: طرحواره‌درمانی، CBT"
                  />
                </label>
              </div>

              <div className={styles.formRow}>
                <label className={styles.field}>
                  <span>سابقه کار (سال)</span>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={form.experienceYears}
                    onChange={(e) => update('experienceYears', e.target.value)}
                    placeholder="مثال: ۱۰"
                  />
                </label>
                <label className={styles.field}>
                  <span>شهر</span>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    placeholder="مثال: تهران"
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span>توضیحات (اختیاری)</span>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  placeholder="هر نکته‌ای که فکر می‌کنید مفید است..."
                />
              </label>

              <motion.button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
              >
                <Send />
                {submitting ? 'در حال ارسال...' : 'ثبت پیش‌ثبت‌نام'}
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
}
