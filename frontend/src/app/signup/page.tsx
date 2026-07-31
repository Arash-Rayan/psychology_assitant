"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import authStyles from "../login/AuthPage.module.css";
import SignupAuthShell from "@/components/signup/SignupAuthShell";
import { SIGNUP_ROLE_OPTIONS } from "@/constants/signupRoles";

export default function SignupRoleChoicePage() {
  return (
    <SignupAuthShell
      title="شما کدام هستید؟"
      subtitle="نقش خود را انتخاب کنید تا فرم ثبت‌نام مناسب برایتان باز شود."
      backHref="/auth"
      backLabel="بازگشت"
      wide
      illustrationIcon={Heart}
      footer={
        <p className={authStyles.switchText}>
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/login" className={authStyles.switchLink}>
            وارد شوید
          </Link>
        </p>
      }
    >
      <div className={authStyles.roleGrid}>
        {SIGNUP_ROLE_OPTIONS.map((option, index) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index, duration: 0.35 }}
            >
              <Link href={option.href} className={authStyles.roleCard}>
                <span className={authStyles.roleIconWrap}>
                  <Icon />
                </span>
                <h2 className={authStyles.roleTitle}>{option.title}</h2>
                <p className={authStyles.roleDescription}>{option.description}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </SignupAuthShell>
  );
}
