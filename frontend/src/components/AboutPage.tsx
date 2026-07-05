import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Brain,
  LayoutDashboard,
  Activity,
  Shield,
  Sparkles,
  Users,
  BarChart3,
  HeartHandshake,
  MessageCircle,
  FileText,
  Mic,
  ClipboardList,
  Calendar,
  HeartPulse,
  Network,
  AlertTriangle,
  Stethoscope,
  ClipboardCheck,
  ArrowLeft,
  Layers,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import styles from './AboutPage.module.css';

const THERAPIST_FEATURES = [
  {
    icon: LayoutDashboard,
    title: 'داشبورد یکپارچه مراجعان',
    description:
      'نمای کلی از همه پرونده‌ها با فیلتر وضعیت (ایمن، نیاز به توجه، فوری) و فیلتر طرحواره؛ جستجو و دسترسی سریع به جزئیات هر مراجع.',
  },
  {
    icon: AlertTriangle,
    title: 'پنل موارد فوری',
    description:
      'لیست هوشمند مراجعان پرریسک بر اساس شاخص‌های رفتاری و هیجانی تا هیچ کیس حساسی از دست نرود.',
  },
  {
    icon: TrendingUp,
    title: 'نمودار روند درمان',
    description:
      'ردیابی امتیاز کلی سلامت روان، اضطراب و خلق در طول زمان؛ مقایسه مراجعان و شناسایی الگوهای بهبود یا افت.',
  },
  {
    icon: FileText,
    title: 'یادداشت‌های ساختارمند جلسه',
    description:
      'ثبت شکایت اصلی، فرمول‌بندی، طرح درمان، تکالیف و اهداف جلسه بعد؛ با خلاصه هوشمند چندجلسه‌ای توسط هوش مصنوعی.',
  },
  {
    icon: Mic,
    title: 'ضبط صوت و تبدیل به متن',
    description:
      'ضبط مستقیم جلسه یا بارگذاری فایل صوتی و تبدیل خودکار به متن فارسی برای پر کردن سریع‌تر یادداشت.',
  },
  {
    icon: ClipboardList,
    title: 'سازنده فرم ارزیابی',
    description:
      'ساخت فرم‌های سفارشی از کتابخانه گسترده موضوعات — از مشکلات کودک و نوجوان تا اختلالات بالغین — و ارسال به مراجع.',
  },
  {
    icon: Calendar,
    title: 'مدیریت کلینیک',
    description:
      'برنامه‌ریزی هفتگی جلسات، مدیریت اتاق‌ها و پزشکان، و پیگیری مراجعان جدید (ورودی) در کنار پرونده‌های فعال.',
  },
  {
    icon: ClipboardCheck,
    title: 'آزمون‌های روان‌شناختی',
    description:
      'اجرای BDI-II (افسردگی) و NEO-FFI (شخصیت) با متن معتبر فارسی؛ ثبت نتایج و پیگیری در پرونده مراجع.',
  },
];

const PATIENT_FEATURES = [
  {
    icon: MessageCircle,
    title: 'پیش‌مشاوره هوشمند',
    description:
      'برای مراجعان جدید: انتخاب موضوع (فردی، زوجین، پیش از ازدواج) و پاسخ به ۱۰ سوال کوتاه تا قبل از اولین ویزیت آماده شوید.',
  },
  {
    icon: HeartHandshake,
    title: 'دستیار بین جلسات',
    description:
      'چت‌بات همدل برای گفتگوی امن بین جلسات؛ ثبت خلق‌وخو و انتقال منظم اطلاعات به درمانگر — بدون جایگزینی رابطه درمانی.',
  },
  {
    icon: HeartPulse,
    title: 'خودارزیابی روان‌شناختی',
    description:
      'دسترسی به تست‌های استاندارد BDI-II و NEO-FFI با تفسیر فارسی؛ نتایج در اختیار درمانگر برای تصمیم‌گیری بالینی.',
  },
  {
    icon: Shield,
    title: 'حریم خصوصی و امنیت',
    description:
      'طراحی با اولویت محرمانگی داده‌ها؛ اطلاعات شما فقط در چارچوب درمان و مطابق اصول اخلاق حرفه‌ای مدیریت می‌شود.',
  },
];

const AI_MODULES = [
  {
    icon: Activity,
    title: 'وضعیت هیجانی',
    description: 'شناسایی شدت افسردگی، اضطراب، خشم، گناه و سایر هیجان‌ها در متن گفتگو.',
  },
  {
    icon: Brain,
    title: 'طرحواره‌ها (یانگ)',
    description: '۱۸ طرحواره ناسازگار اولیه — از رهاشدگی تا استانداردهای سخت‌گیرانه — با نمره ۰ تا ۱۰.',
  },
  {
    icon: Network,
    title: 'تحریف‌های شناختی',
    description: 'تشخیص فاجعه‌سازی، تفکر همه‌یا‌هیچ، شخصی‌سازی و سایر الگوهای شناختی.',
  },
  {
    icon: Users,
    title: 'دلبستگی و روابط',
    description: 'سبک دلبستگی (مضطرب، اجتنابی، ایمن) و الگوهای تعاملی در روابط.',
  },
  {
    icon: BarChart3,
    title: 'خصیصه‌های شخصیتی',
    description: 'ارزیابی پنج‌عاملی NEO — روان‌رنجوری، برون‌گرایی، گشودگی، سازگاری و وظیفه‌شناسی.',
  },
  {
    icon: AlertTriangle,
    title: 'شاخص‌های ریسک',
    description: 'امتیازدهی به افکار خودآسیب، مصرف مواد، خشونت و افت عملکرد.',
  },
  {
    icon: Stethoscope,
    title: 'سطح عملکرد',
    description: 'ارزیابی عملکرد شغلی، اجتماعی و روزمره مراجع.',
  },
  {
    icon: Layers,
    title: 'متاآنالیز بالینی',
    description: 'ترکیب همه ماژول‌ها در یک روایت یکپارچه برای تصمیم‌گیری درمانگر.',
  },
];

const JOURNEY_STEPS = [
  {
    step: '۱',
    title: 'پیش‌مشاوره یا ورود',
    description: 'مراجع جدید از چت پیش‌مشاوره یا فرم ورودی شروع می‌کند؛ داده‌ها ساختارمند ذخیره می‌شوند.',
  },
  {
    step: '۲',
    title: 'جلسات و یادداشت',
    description: 'درمانگر یادداشت بالینی ثبت می‌کند — تایپ، ضبط صوت یا بارگذاری — و فرم‌ها و تست‌ها ارسال می‌شوند.',
  },
  {
    step: '۳',
    title: 'تحلیل چندعاملی',
    description: 'هوش مصنوعی متن گفتگو را از زوایای هیجان، طرحواره، ریسک و شخصیت تحلیل می‌کند.',
  },
  {
    step: '۴',
    title: 'داشبورد و پیگیری',
    description: 'نمره‌ها، نمودار روند و هشدارهای فوری در داشبورد نمایش داده می‌شوند تا مداخله هدفمند شود.',
  },
];

export function AboutPage() {
  return (
    <div className={styles.container} dir="rtl">
      {/* Hero / Intro */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.heroSection}
      >
        <div className={styles.heroContent}>
          <div className={styles.heroHeader}>
            <div className={styles.badge}>
              <Sparkles />
              <span>درباره روانصد</span>
            </div>
            <h1 className={styles.title}>
              پلتفرم جامع سلامت روان
              <span className={styles.titlePrimary}> برای درمانگر و مراجع</span>
            </h1>
            <p className={styles.subtitle}>
              روانصد برای درمانگران و مراجعان فارسی‌زبان طراحی شده است — از پیش‌مشاوره و چت بین جلسات تا
              یادداشت صوتی جلسه، تحلیل چندعاملی هوش مصنوعی و داشبورد بالینی یکپارچه؛ همه در یک محیط ایمن.
            </p>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCardPrimary}>
              <div className={styles.heroIcon}>
                <Brain />
              </div>
              <h2>ماموریت ما</h2>
              <p>
                هدف روانصد توانمندسازی درمانگران فارسی‌زبان با ابزارهای داده‌محور است: ریسک زودتر دیده
                شود، روند درمان شفاف‌تر ردیابی شود و زمان بیشتری برای رابطه انسانی و قضاوت حرفه‌ای باقی
                بماند — نه جایگزینی آن.
              </p>
            </div>

            <div className={styles.heroCardGrid}>
              <div className={styles.heroSubCard}>
                <LayoutDashboard />
                <h3>داشبورد درمانگر</h3>
                <p>مراجعان، ریسک، جلسات و روند امتیاز در یک نگاه.</p>
              </div>
              <div className={styles.heroSubCard}>
                <MessageCircle />
                <h3>چت هوشمند</h3>
                <p>پیش‌مشاوره و دستیار بین جلسات برای مراجعان.</p>
              </div>
              <div className={styles.heroSubCard}>
                <Mic />
                <h3>یادداشت صوتی</h3>
                <p>ضبط جلسه و تبدیل خودکار به متن فارسی.</p>
              </div>
              <div className={styles.heroSubCard}>
                <Shield />
                <h3>حریم خصوصی</h3>
                <p>امنیت و محرمانگی مطابق اصول اخلاق حرفه‌ای.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Therapist features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className={styles.section}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>برای درمانگران</span>
            <h2>ابزارهای بالینی در یک پنل</h2>
            <p>
              هر آنچه برای مدیریت پرونده، ثبت جلسه، برنامه‌ریزی کلینیک و تصمیم‌گیری مبتنی بر داده نیاز
              دارید — بدون پراکندگی بین چند نرم‌افزار.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {THERAPIST_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.05 }}
                className={styles.featureCard}
              >
                <div className={styles.featureIcon}>
                  <feature.icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Patient features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${styles.section} ${styles.sectionAlt}`}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>برای مراجعان</span>
            <h2>همراهی امن قبل، بین و بعد از جلسه</h2>
            <p>
              مراجعان هم از روانصد بهره می‌برند: آماده‌سازی قبل از اولین ویزیت، پشتیبانی بین جلسات و
              دسترسی به خودارزیابی‌های معتبر — همه با حفظ حریم خصوصی.
            </p>
          </div>

          <div className={styles.patientFeaturesGrid}>
            {PATIENT_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.08 }}
                className={styles.patientFeatureCard}
              >
                <div className={styles.patientFeatureIcon}>
                  <feature.icon />
                </div>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Patient journey */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className={styles.section}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>مسیر داده</span>
            <h2>از اولین تماس تا تصمیم بالینی</h2>
            <p>
              روانصد جریان کامل اطلاعات را یکپارچه می‌کند — از ورود مراجع تا تحلیل هوشمند و نمایش در
              داشبورد.
            </p>
          </div>

          <div className={styles.journeyGrid}>
            {JOURNEY_STEPS.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.1 }}
                className={styles.journeyCard}
              >
                <span className={styles.journeyStep}>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {index < JOURNEY_STEPS.length - 1 && (
                  <span className={styles.journeyArrow} aria-hidden="true">
                    <ArrowLeft />
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How the dashboard works */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={`${styles.section} ${styles.sectionAlt}`}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>داشبورد</span>
            <h2>چطور داشبورد درمانگر کار می‌کند؟</h2>
            <p>
              پنل درمانگر طوری طراحی شده که در یک نگاه تصویر جامعی از پرونده‌ها بدهد و در عین حال امکان
              ورود به جزئیات هر مراجع را فراهم کند.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <span className={styles.stepBadge}>۱</span>
              <h3>جمع‌آوری داده‌های ساختارمند</h3>
              <p>
                هر جلسه، یادداشت درمانگر، فرم ارزیابی، نتایج تست و خلاصه گفتگوها در قالبی یکپارچه ذخیره
                می‌شوند.
              </p>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepBadge}>۲</span>
              <h3>نمایش هوشمند پرونده‌ها</h3>
              <p>
                برای هر مراجع، وضعیت کلی، جلسات اخیر، روند خلق و طرحواره‌های فعال در کارت‌های تعاملی
                نمایش داده می‌شوند.
              </p>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepBadge}>۳</span>
              <h3>تحلیل تصویری روند درمان</h3>
              <p>
                نمودارهای تعاملی نشان می‌دهند کدام مراجعان در مسیر بهبود پایدارند و کجا نیاز به مداخله
                بیشتر است.
              </p>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepBadge}>۴</span>
              <h3>تمرکز بر بیماران پرریسک</h3>
              <p>
                با ترکیب شاخص‌های رفتاری و هیجانی، مراجعان در وضعیت «نیاز به توجه» یا «فوری» برجسته
                می‌شوند.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* AI analysis modules */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={styles.section}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>هوش مصنوعی</span>
            <h2>تحلیل چندعاملی سلامت روان</h2>
            <p>
              پشت صحنه روانصد مجموعه‌ای از ماژول‌های تخصصی قرار دارد که متن گفتگو را از چند زاویه بررسی
              می‌کنند. خروجی به‌صورت نمره‌های قابل‌ردیابی و خلاصه بالینی در اختیار درمانگر است.
            </p>

            <div className={styles.analysisVisualRow} aria-hidden="true">
              <div className={styles.analysisPill}>
                <div className={styles.analysisPillIcon}>
                  <Activity />
                </div>
                <span>هیجان‌ها</span>
              </div>
              <div className={styles.analysisPill}>
                <div className={styles.analysisPillIcon}>
                  <Brain />
                </div>
                <span>طرحواره‌ها</span>
              </div>
              <div className={styles.analysisPill}>
                <div className={styles.analysisPillIcon}>
                  <Network />
                </div>
                <span>شناخت</span>
              </div>
              <div className={styles.analysisPill}>
                <div className={styles.analysisPillIcon}>
                  <Users />
                </div>
                <span>دلبستگی</span>
              </div>
              <div className={styles.analysisPill}>
                <div className={styles.analysisPillIcon}>
                  <UserCheck />
                </div>
                <span>شخصیت</span>
              </div>
              <div className={styles.analysisPill}>
                <div className={styles.analysisPillIcon}>
                  <Shield />
                </div>
                <span>ریسک</span>
              </div>
            </div>
          </div>

          <div className={styles.modulesGrid}>
            {AI_MODULES.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: index * 0.04 }}
                className={styles.moduleCard}
              >
                <div className={styles.moduleIcon}>
                  <module.icon />
                </div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </motion.div>
            ))}
          </div>

          <div className={styles.analysisHighlight}>
            <div className={styles.analysisHighlightIcon}>
              <Sparkles />
            </div>
            <div>
              <h3>روایت بالینی یکپارچه — نه جایگزین قضاوت درمانگر</h3>
              <p>
                لایه متاآنالیز همه نمره‌ها را ترکیب می‌کند و یک خلاصه بالینی از گفت‌وگو می‌سازد. تصمیم
                نهایی، برنامه درمان و مداخله همواره با انسان است؛ هوش مصنوعی فقط دید گسترده‌تر و مستندتری
                فراهم می‌کند.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Human + AI philosophy */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className={styles.section}
      >
        <div className={styles.sectionContent}>
          <div className={styles.philosophyCard}>
            <div className={styles.philosophyOrbits} aria-hidden="true">
              <div className={styles.philosophyCircleLarge} />
              <div className={styles.philosophyCircleSmall} />
            </div>

            <div className={styles.philosophyHeader}>
              <div className={styles.philosophyIcon}>
                <HeartHandshake />
              </div>
              <div>
                <h2>ترکیب «انسان» و «ماشین» برای مراقبت بهتر</h2>
                <p>
                  روانصد جایگزین درمانگر نیست؛ ابزاری است تا زمان بیشتری برای رابطه درمانی و مداخله‌های
                  عمیق‌تر داشته باشید.
                </p>
              </div>
            </div>

            <div className={styles.philosophyGrid}>
              <div className={styles.philosophyItem}>
                <h3>تمرکز بیشتر روی خود انسان</h3>
                <p>
                  با خودکار شدن بخشی از تحلیل‌ها و ثبت داده‌ها، وقت درمانگر آزاد می‌شود تا روی شنیدن،
                  همدلی و کار بالینی تمرکز کند.
                </p>
              </div>
              <div className={styles.philosophyItem}>
                <h3>تصمیم‌گیری شفاف‌تر</h3>
                <p>
                  نمودارها و شاخص‌های مشخص کمک می‌کنند تصمیم‌های درمانی مستند و قابل پیگیری باشند.
                </p>
              </div>
              <div className={styles.philosophyItem}>
                <h3>پیشگیری به‌جای غافلگیری</h3>
                <p>
                  شناسایی زودهنگام تغییرات در خلق، طرحواره‌ها و شاخص‌های ریسک، امکان مداخله پیشگیرانه را
                  فراهم می‌کند.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={styles.ctaSection}
      >
        <div className={styles.ctaContent}>
          <h2>آماده‌اید روانصد را امتحان کنید؟</h2>
          <p>
            درمانگر هستید؟ پیش‌ثبت‌نام کنید. مراجع هستید؟ پیش‌مشاوره یا گفتگو با دستیار را شروع کنید.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/intro" className={styles.ctaPrimary}>
              <Stethoscope />
              پیش‌ثبت‌نام درمانگران
            </Link>
            <Link href="/chat/pre-consult" className={styles.ctaSecondary}>
              <MessageCircle />
              شروع پیش‌مشاوره
            </Link>
            <Link href="/chat" className={styles.ctaSecondary}>
              <HeartHandshake />
              گفتگو با دستیار
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
