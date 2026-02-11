"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { UserPlus, LogIn, HeartHandshake } from "lucide-react";
import styles from "@/components/HomePage.module.css";
import authStyles from "../login/AuthPage.module.css";

export default function AuthChoicePage() {
  return (
    <div className={`${styles.container} ${authStyles.authContainer}`} dir="rtl">
      <section className={authStyles.authHeroSection}>
        <div className={styles.heroContent}>
          <div className={`${styles.heroGrid} ${authStyles.authGrid}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={authStyles.authCard}
            >
              <div className={authStyles.cardHeader}>
                <h1 className={authStyles.authTitle}>خوش آمدید به روانصد</h1>
                <p className={authStyles.authSubtitle}>
                  برای شروع، انتخاب کنید که می‌خواهید وارد شوید یا یک حساب جدید
                  بسازید.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Link
                  href="/login"
                  className={`${styles.primaryButton} ${authStyles.submitButton}`}
                >
                  <LogIn />
                  <span>ورود به حساب کاربری</span>
                </Link>

                <Link
                  href="/signup"
                  className={`${styles.secondaryButton} ${authStyles.submitButton}`}
                >
                  <UserPlus />
                  <span>ایجاد حساب جدید</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className={styles.illustrationContainer}
            >
              <div className={styles.illustrationBg}></div>
              <div className={styles.illustrationCard}>
                <div className={styles.illustrationContent}>
                  <div className={styles.connectionContainer}>
                    <div className={styles.connectionCircle}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className={styles.rotatingBorder}
                      ></motion.div>
                      <div className={styles.innerCircle}>
                        <HeartHandshake />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}


