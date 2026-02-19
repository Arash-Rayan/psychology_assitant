import { motion } from 'motion/react';
import { Brain, LayoutDashboard, Activity, Shield, Sparkles, Users, BarChart3, HeartHandshake } from 'lucide-react';
import styles from './AboutPage.module.css';

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
              ترکیب علم روانشناسی
              <span className={styles.titlePrimary}> با هوش مصنوعی بالینی</span>
            </h1>
            <p className={styles.subtitle}>
              روانصد برای درمانگران و مراجعان فارسی‌زبان طراحی شده است؛ جایی که تحلیل داده‌های جلسات، ردیابی روند
              سلامت روان و تصمیم‌گیری بالینی، در یک داشبورد یکپارچه و ایمن کنار هم قرار می‌گیرد.
            </p>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCardPrimary}>
              <div className={styles.heroIcon}>
                <Brain />
              </div>
              <h2>ماموریت ما</h2>
              <p>
                هدف روانصد این است که درمانگران را با ابزارهای داده‌محور و هوشمند مجهز کند تا بتوانند ریسک، الگوهای
                هیجانی و روند درمان مراجعان را شفاف‌تر و سریع‌تر ارزیابی کنند؛ بدون این‌که جای رابطه انسانی و قضاوت
                حرفه‌ای را بگیرد.
              </p>
            </div>

            <div className={styles.heroCardGrid}>
              <div className={styles.heroSubCard}>
                <LayoutDashboard />
                <h3>داشبورد درمانگر</h3>
                <p>نمای کلی از همه مراجعان، وضعیت ریسک، جلسات اخیر و روند امتیاز سلامت روان در یک صفحه.</p>
              </div>
              <div className={styles.heroSubCard}>
                <Activity />
                <h3>تحلیل روند</h3>
                <p>نمودارها و شاخص‌های کلیدی برای دنبال کردن تغییرات خلق، اضطراب و طرحواره‌ها در طول زمان.</p>
              </div>
              <div className={styles.heroSubCard}>
                <Users />
                <h3>تمرکز روی موارد فوری</h3>
                <p>لیست هوشمند مراجعان در وضعیت «فوری» تا شما هیچ‌وقت کیس‌های پرریسک را از دست ندهید.</p>
              </div>
              <div className={styles.heroSubCard}>
                <Shield />
                <h3>حریم خصوصی</h3>
                <p>طراحی شده با اولویت امنیت و محرمانگی داده‌ها، مطابق با اصول اخلاق حرفه‌ای در سلامت روان.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How the dashboard works */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={styles.section}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2>چطور داشبورد درمانگر کار می‌کند؟</h2>
            <p>
              پنل درمانگر روانصد طوری طراحی شده است که در یک نگاه، تصویر جامعی از وضعیت پرونده‌های شما ارائه دهد و
              در عین حال امکان ورود به جزئیات هر مراجع را فراهم کند.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <span className={styles.stepBadge}>۱</span>
              <h3>جمع‌آوری داده‌های ساختارمند</h3>
              <p>
                هر جلسه، یادداشت‌های درمانگر، فرم‌های ارزیابی و خلاصه گفتگوها در قالبی ساختارمند ذخیره می‌شوند تا بعدها
                بتوان روی آن‌ها تحلیل دقیق انجام داد.
              </p>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepBadge}>۲</span>
              <h3>نمایش هوشمند پرونده‌ها</h3>
              <p>
                برای هر مراجع، شاخص‌هایی مثل وضعیت کلی، جلسات اخیر، روند خلق و طرحواره‌های فعال در کارت‌های تعاملی
                نمایش داده می‌شوند.
              </p>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepBadge}>۳</span>
              <h3>تحلیل تصویری روند درمان</h3>
              <p>
                نمودارهای تعاملی به شما کمک می‌کنند ببینید کدام مراجعان در مسیر بهبود پایدار هستند و کجا نیاز به
                مداخله بیشتر وجود دارد.
              </p>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepBadge}>۴</span>
              <h3>تمرکز بر بیماران پرریسک</h3>
              <p>
                با ترکیب شاخص‌های رفتاری و هیجانی، مراجعانی که در وضعیت «نیاز به توجه» یا «فوری» قرار دارند برجسته
                می‌شوند تا برنامه‌ریزی شما هدفمندتر باشد.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How we analyze mental health */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={styles.section}
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2>تحلیل سلامت روان با کمک هوش مصنوعی</h2>
            <p>
              پشت صحنه روانصد مجموعه‌ای از ماژول‌های تحلیلی قرار دارد که متن گفتگو را از چند زاویه بررسی می‌کنند:
              هیجان‌ها، افکار، طرحواره‌ها، روابط، سطح عملکرد و شاخص‌های ریسک. خروجی این تحلیل‌ها به‌صورت نمره‌های
              قابل‌ردیابی و خلاصه‌های بالینی در اختیار درمانگر قرار می‌گیرد.
            </p>

            <div className={styles.analysisVisualRow} aria-hidden="true">
              <div className={styles.analysisPill}>
                <div className={styles.analysisPillIcon}>
                  <Activity />
                </div>
                <span>هیجان‌ها و خلق</span>
              </div>
              <div className={styles.analysisPill}>
                <div className={styles.analysisPillIcon}>
                  <Brain />
                </div>
                <span>طرحواره‌ها و افکار</span>
              </div>
              <div className={styles.analysisPill}>
                <div className={styles.analysisPillIcon}>
                  <Users />
                </div>
                <span>روابط و دلبستگی</span>
              </div>
              <div className={styles.analysisPill}>
                <div className={styles.analysisPillIcon}>
                  <Shield />
                </div>
                <span>ریسک و ایمنی</span>
              </div>
            </div>
          </div>

          <div className={styles.analysisGrid}>
            <div className={styles.analysisCard}>
              <div className={styles.analysisIcon}>
                <BarChart3 />
              </div>
              <h3>طرحواره‌ها و الگوهای عمیق</h3>
              <p>
                ماژول طرحواره بر اساس رویکرد جفری یانگ، ۱۸ طرحواره ناسازگار اولیه مانند «رهاشدگی»، «بی‌اعتمادی»،
                «محرومیت هیجانی» یا «استانداردهای سخت‌گیرانه» را در متن شناسایی و به هرکدام نمره‌ای بین ۰ تا ۱۰
                اختصاص می‌دهد تا تصویر عمیق‌تری از الگوهای ریشه‌ای فرد به دست آید.
              </p>
            </div>

            <div className={styles.analysisCard}>
              <div className={styles.analysisIcon}>
                <Activity />
              </div>
              <h3>شاخص‌های ریسک و ایمنی</h3>
              <p>
                ماژول ریسک به نشانه‌هایی مثل افکار مرگ، افکار خودآسیب‌رسان، مصرف مواد، خشونت، و افت شدید عملکرد امتیاز
                می‌دهد تا موارد پرریسک به‌صورت شفاف و مستند برای پیگیری بالینی برجسته شوند.
              </p>
            </div>

            <div className={styles.analysisCard}>
              <div className={styles.analysisIcon}>
                <Sparkles />
              </div>
              <h3>هیجان‌ها، افکار و سبک‌های دلبستگی</h3>
              <p>
                ماژول‌های دیگر، شدت هیجان‌هایی مثل افسردگی، اضطراب و احساس گناه، تحریف‌های شناختی مانند فاجعه‌سازی یا
                تفکر همه یا هیچ، سبک دلبستگی (مثلاً دلبستگی مضطرب یا اجتنابی)، و خصیصه‌های شخصیتی را در یک ساختار
                قابل‌فهم خلاصه می‌کنند.
              </p>
            </div>

            <div className={styles.analysisCard}>
              <div className={styles.analysisIcon}>
                <Shield />
              </div>
              <h3>ادغام نهایی برای تصویر بالینی یکپارچه</h3>
              <p>
                در پایان، یک لایه «متاآنالیز» همه این نمره‌ها را ترکیب می‌کند و یک روایت بالینی یکپارچه از گفت‌وگو
                می‌سازد؛ روایتی که به درمانگر کمک می‌کند روند درمان، ریسک‌ها و نقاط قوت را شفاف‌تر ببیند، در حالی‌که
                تصمیم نهایی همواره با انسان است.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Human + AI philosophy */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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
                  روانصد جایگزین درمانگر نیست؛ بلکه ابزاری است تا شما زمان بیشتری برای رابطه درمانی و مداخله‌های
                  عمیق‌تر داشته باشید.
                </p>
              </div>
            </div>

            <div className={styles.philosophyGrid}>
              <div className={styles.philosophyItem}>
                <h3>تمرکز بیشتر روی خود انسان</h3>
                <p>
                  با خودکار شدن بخشی از تحلیل‌ها و ثبت داده‌ها، وقت درمانگر آزاد می‌شود تا روی شنیدن، همدلی و کار
                  بالینی تمرکز کند.
                </p>
              </div>
              <div className={styles.philosophyItem}>
                <h3>تصمیم‌گیری شفاف‌تر</h3>
                <p>
                  نمودارها و شاخص‌های مشخص کمک می‌کنند تصمیم‌های درمانی، مثل افزایش جلسات یا تغییر رویکرد، مستند و
                  قابل پیگیری باشند.
                </p>
              </div>
              <div className={styles.philosophyItem}>
                <h3>پیشگیری به‌جای غافلگیری</h3>
                <p>
                  شناسایی زودهنگام تغییرات در خلق، طرحواره‌ها و شاخص‌های ریسک، امکان مداخله پیشگیرانه را فراهم
                  می‌کند.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

