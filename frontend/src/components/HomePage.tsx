import { motion } from 'motion/react';
import Link from 'next/link';
import { Brain, MessageCircle, TrendingUp, Shield, Sparkles, Heart, Smile, Activity } from 'lucide-react';
import styles from './HomePage.module.css';

export function HomePage() {
  const features = [
    {
      icon: MessageCircle,
      title: 'گفتگوی هوشمند',
      description: 'چت‌بات هوشمند با قابلیت تحلیل احساسات و الگوهای گفتگو'
    },
    {
      icon: TrendingUp,
      title: 'پیگیری روند بهبود',
      description: 'نمودارهای دقیق برای ردیابی وضعیت روحی و پیشرفت درمان'
    },
    {
      icon: Shield,
      title: 'محرمانگی کامل',
      description: 'امنیت و حفظ حریم خصوصی شما اولویت اول ماست'
    },
    {
      icon: Sparkles,
      title: 'تحلیل پیشرفته',
      description: 'هوش مصنوعی پیشرفته برای شناسایی الگوهای رفتاری'
    }
  ];

  return (
    <div className={styles.container} dir="rtl">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.heroSection}
      >
        <div className={styles.heroContent}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={styles.badge}
              >
                <Sparkles />
                <span>پلتفرم سلامت روان با هوش مصنوعی</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={styles.title}
              >
                همراه شما در مسیر
                <span className={styles.titlePrimary}> سلامت روان</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className={styles.description}
              >
                با استفاده از هوش مصنوعی و تکنولوژی‌های نوین، به شما کمک می‌کنیم تا احساس بهتری داشته باشید و مسیر بهبود را با آرامش طی کنید.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={styles.buttonGroup}
              >
                <Link
                  href="/chat"
                  className={styles.primaryButton}
                >
                  <MessageCircle />
                  <span>شروع گفتگو با روان‌یار</span>
                </Link>
                
                <button className={styles.secondaryButton}>
                  <span>درباره ما</span>
                </button>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className={styles.illustrationContainer}
            >
              <div className={styles.illustrationBg}></div>
              <div className={styles.illustrationCard}>
                {/* Illustration Area */}
                <div className={styles.illustrationContent}>
                  {/* Decorative circles */}
                  <div className={styles.circleGroup}>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className={`${styles.circle} ${styles.circlePrimary}`}
                    >
                      <Brain />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                      className={`${styles.circle} ${styles.circleSecondary}`}
                    >
                      <Heart />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                      className={`${styles.circle} ${styles.circleAccent}`}
                    >
                      <Smile />
                    </motion.div>
                  </div>
                  
                  {/* Connection lines visualization */}
                  <div className={styles.connectionContainer}>
                    <div className={styles.connectionCircle}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className={styles.rotatingBorder}
                      ></motion.div>
                      <div className={styles.innerCircle}>
                        <Activity />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className={styles.featuresSection}
      >
        <div className={styles.featuresContent}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>امکانات پلتفرم</h2>
            <p className={styles.featuresSubtitle}>ابزارهای پیشرفته برای سلامت روان شما</p>
          </div>
          
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={styles.featureCard}
              >
                <div className={styles.featureIcon}>
                  <feature.icon />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className={styles.ctaSection}
      >
        <div className={styles.ctaContent}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaGradient}></div>
            <div className={styles.ctaInner}>
              <Brain className={styles.ctaIcon} />
              <h2 className={styles.ctaTitle}>آماده شروع هستید؟</h2>
              <p className={styles.ctaDescription}>همین حالا با روان‌یار گفتگو را شروع کنید</p>
              <Link
                href="/chat"
                className={styles.ctaButton}
              >
                <MessageCircle />
                <span>شروع گفتگو</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
