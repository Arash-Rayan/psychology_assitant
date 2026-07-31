"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import styles from "@/components/HomePage.module.css";
import authStyles from "@/app/login/AuthPage.module.css";

type SignupFormShellProps = {
  title: string;
  subtitle: string;
  illustrationIcon: LucideIcon;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
  wide?: boolean;
};

export default function SignupFormShell({
  title,
  subtitle,
  illustrationIcon: IllustrationIcon,
  children,
  backHref = "/signup",
  backLabel = "بازگشت به انتخاب نقش",
  wide = false,
}: SignupFormShellProps) {
  return (
    <div className={`${styles.container} ${authStyles.authContainer}`} dir="rtl">
      <section className={authStyles.authHeroSection}>
        <div className={styles.heroContent}>
          <div className={`${styles.heroGrid} ${authStyles.authGrid}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`${authStyles.authCard} ${wide ? authStyles.authCardWide : ""}`}
            >
              <Link href={backHref} className={authStyles.backButton}>
                <ArrowRight size={18} />
                <span>{backLabel}</span>
              </Link>

              <div className={authStyles.cardHeader}>
                <h1 className={authStyles.authTitle}>{title}</h1>
                <p className={authStyles.authSubtitle}>{subtitle}</p>
              </div>

              {children}
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
                        <IllustrationIcon />
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
