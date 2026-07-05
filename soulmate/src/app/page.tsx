import Link from "next/link";
import { Star, Calendar, Sparkles, BarChart3, MessageCircle, ArrowLeft } from "lucide-react";
import { PRODUCT } from "@/lib/constants";
import styles from "./landing.module.css";

const FEATURES = [
  { icon: Calendar, title: "برنامه ساعتی", desc: "روز، هفته، ماه، سال — task به هر ساعت" },
  { icon: BarChart3, title: "تحلیل پیشرفت", desc: "هفته، ماه، سال — روند up یا down" },
  { icon: MessageCircle, title: "گفتگو با AI", desc: "استرس، موسیقی، فلسفه، برنامه" },
  { icon: Sparkles, title: "بینش و پیشنهاد", desc: "کتاب، podcast، نقاط قوت و ضعف" },
];

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <Star size={22} />
          <span className={styles.logoText}>
            {PRODUCT.name}
            <small>AI</small>
          </span>
        </Link>
        <div className={styles.navLinks}>
          <a href="#features">امکانات</a>
          <Link href="/dashboard">ورود به demo</Link>
        </div>
        <Link href="/dashboard" className={styles.ctaNav}>
          شروع رایگان
        </Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.badge}>by {PRODUCT.company} · اعتبارسنجی روانشناسی</p>
          <h1>
            تقویم هوشمند
            <br />
            <span className="gradient-text">که زندگی‌ات را می‌فهمد</span>
          </h1>
          <p className={styles.sub}>
            کار را ساعت‌به‌ساعت برنامه‌ریزی کن. AI پیشنهاد می‌دهد، پیشرفت را track می‌کند،
            درباره استرس و علایقت گوش می‌دهد.
          </p>
          <div className={styles.heroBtns}>
            <Link href="/dashboard" className={styles.btnPrimary}>
              باز کردن demo
              <ArrowLeft size={18} />
            </Link>
            <Link href="/planner" className={styles.btnGhost}>
              تقویم ساعتی
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={`${styles.mockDashboard} glass`}>
            <div className={styles.mockHeader}>
              <span>۸۷٪ بهره‌وری</span>
            </div>
            <div className={styles.mockTasks}>
              <div className={`${styles.mockTask} ${styles.done}`}>کار عمیق ۰۸:۰۰</div>
              <div className={`${styles.mockTask} ${styles.done}`}>آمار ۱۰:۳۰</div>
              <div className={styles.mockTask}>جلسه ۱۴:۰۰</div>
              <div className={styles.mockTask}>journal ۱۹:۰۰</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className={styles.features}>
        <h2>همه‌چیز در یک AI calendar</h2>
        <div className={styles.featureGrid}>
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className={`${styles.featureCard} glass`}>
                <Icon size={24} className={styles.featureIcon} />
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={`glass ${styles.ctaBox}`}>
          <h2>محصول جدا از روانصد درمانی</h2>
          <p>wellness + planner — نه اپ قرار</p>
          <Link href="/dashboard" className={styles.btnPrimary}>
            ورود به demo
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>
          {PRODUCT.name} · {PRODUCT.companyEn} · Smart AI Calendar Demo
        </p>
      </footer>
    </div>
  );
}
