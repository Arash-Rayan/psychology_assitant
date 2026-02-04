"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { Lock, Mail, User, Loader2 } from "lucide-react";
import styles from "@/components/HomePage.module.css";
import authStyles from "./AuthPage.module.css";
import { toast } from "sonner";

type LoginFormValues = {
  email: string;
  password: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.detail || "خطا در ورود. لطفاً دوباره تلاش کنید.");
      }

      if (json.token) {
        window.localStorage.setItem("auth_token", json.token);
      }

      toast.success("ورود با موفقیت انجام شد.");
      // TODO: Redirect to dashboard or chat
    } catch (error: any) {
      toast.error(error.message || "خطایی رخ داده است.");
    } finally {
      setLoading(false);
    }
  };

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
                <h1 className={authStyles.authTitle}>ورود به حساب کاربری</h1>
                <p className={authStyles.authSubtitle}>
                  برای ادامه استفاده از خدمات سلامت روان، وارد حساب خود شوید.
                </p>
              </div>

              <form
                className={authStyles.form}
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className={authStyles.formGroup}>
                  <label className={authStyles.label}>
                    <span>ایمیل</span>
                    <span className={authStyles.labelIcon}>
                      <Mail size={16} />
                    </span>
                  </label>
                  <input
                    type="email"
                    className={authStyles.input}
                    placeholder="example@mail.com"
                    {...register("email", {
                      required: "ایمیل الزامی است.",
                    })}
                  />
                  {errors.email && (
                    <p className={authStyles.errorText}>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className={authStyles.formGroup}>
                  <label className={authStyles.label}>
                    <span>رمز عبور</span>
                    <span className={authStyles.labelIcon}>
                      <Lock size={16} />
                    </span>
                  </label>
                  <input
                    type="password"
                    className={authStyles.input}
                    placeholder="********"
                    {...register("password", {
                      required: "رمز عبور الزامی است.",
                      minLength: {
                        value: 6,
                        message: "رمز عبور باید حداقل ۶ کاراکتر باشد.",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className={authStyles.errorText}>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className={`${styles.primaryButton} ${authStyles.submitButton}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className={authStyles.spinner} />
                      <span>در حال ورود...</span>
                    </>
                  ) : (
                    <>
                      <User />
                      <span>ورود</span>
                    </>
                  )}
                </button>
              </form>

              <p className={authStyles.switchText}>
                حساب کاربری ندارید؟{" "}
                <Link href="/signup" className={authStyles.switchLink}>
                  ثبت‌نام کنید
                </Link>
              </p>
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
                        <Lock />
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


