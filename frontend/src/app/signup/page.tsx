"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { Lock, Mail, User, Loader2, Heart, ArrowRight } from "lucide-react";
import styles from "@/components/HomePage.module.css";
import authStyles from "../login/AuthPage.module.css";
import { toast } from "sonner";

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.detail || "خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.");
      }

      toast.success("ثبت‌نام با موفقیت انجام شد. اکنون می‌توانید وارد شوید.");
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
              <Link 
                href="/home" 
                className={authStyles.backButton}
              >
                <ArrowRight size={18} />
                <span>بازگشت به خانه</span>
              </Link>
              
              <div className={authStyles.cardHeader}>
                <h1 className={authStyles.authTitle}>ایجاد حساب کاربری</h1>
                <p className={authStyles.authSubtitle}>
                  تنها در چند ثانیه، حساب کاربری خود را بسازید و مسیر بهبود را
                  آغاز کنید.
                </p>
              </div>

              <form
                className={authStyles.form}
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className={authStyles.formGroup}>
                  <label className={authStyles.label}>
                    <span>نام و نام خانوادگی</span>
                    <span className={authStyles.labelIcon}>
                      <User size={16} />
                    </span>
                  </label>
                  <input
                    type="text"
                    className={authStyles.input}
                    placeholder="نام کامل شما"
                    {...register("name", {
                      required: "نام الزامی است.",
                      minLength: {
                        value: 3,
                        message: "نام باید حداقل ۳ کاراکتر باشد.",
                      },
                    })}
                  />
                  <p className={`${authStyles.errorText} ${!errors.name ? authStyles.errorTextEmpty : ''}`}>
                    {errors.name?.message || "\u00A0"}
                  </p>
                </div>

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
                  <p className={`${authStyles.errorText} ${!errors.email ? authStyles.errorTextEmpty : ''}`}>
                    {errors.email?.message || "\u00A0"}
                  </p>
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
                  <p className={`${authStyles.errorText} ${!errors.password ? authStyles.errorTextEmpty : ''}`}>
                    {errors.password?.message || "\u00A0"}
                  </p>
                </div>

                <button
                  type="submit"
                  className={`${styles.primaryButton} ${authStyles.submitButton}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className={authStyles.spinner} />
                      <span>در حال ثبت‌نام...</span>
                    </>
                  ) : (
                    <>
                      <Heart />
                      <span>ثبت‌نام</span>
                    </>
                  )}
                </button>
              </form>

              <p className={authStyles.switchText}>
                قبلاً ثبت‌نام کرده‌اید؟{" "}
                <Link href="/login" className={authStyles.switchLink}>
                  وارد شوید
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
                        <Heart />
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


