"use client";

import Link from "next/link";
import { useState } from "react";
import {
  useForm,
  type FieldValues,
  type Path,
  type RegisterOptions,
  type UseFormRegister,
  type FieldErrors,
} from "react-hook-form";
import {
  Lock,
  Mail,
  User,
  Phone,
  BadgeCheck,
  KeyRound,
  BriefcaseMedical,
  Loader2,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import styles from "@/components/HomePage.module.css";
import authStyles from "@/app/login/AuthPage.module.css";
import SignupAuthShell from "@/components/signup/SignupAuthShell";
import { DOCTOR_EXPERTISE_OPTIONS } from "@/constants/doctorExpertise";
import type { UserRole } from "@/types/user";
import type { LucideIcon } from "lucide-react";

type BaseFields = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
};

type DoctorFields = BaseFields & {
  expertise: string;
  medicalLicenseNumber: string;
};

type WithReferralFields = BaseFields & {
  doctorReferralCode: string;
};

type FormByRole = {
  doctor: DoctorFields;
  secretary: WithReferralFields;
  patient_new: BaseFields;
  patient_existing: WithReferralFields;
};

type RoleSignupFormProps<R extends UserRole> = {
  role: R;
  title: string;
  subtitle: string;
  illustrationIcon: LucideIcon;
};

const phonePattern = /^09\d{9}$/;

function FieldError<T extends FieldValues>({
  errors,
  name,
}: {
  errors: FieldErrors<T>;
  name: Path<T>;
}) {
  const message = errors[name]?.message as string | undefined;
  return (
    <p
      className={`${authStyles.errorText} ${!message ? authStyles.errorTextEmpty : ""}`}
    >
      {message || "\u00A0"}
    </p>
  );
}

function TextField<T extends FieldValues>({
  label,
  icon: Icon,
  name,
  register,
  errors,
  type = "text",
  placeholder,
  rules,
  as = "input",
  options,
  hint,
}: {
  label: string;
  icon: LucideIcon;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  type?: string;
  placeholder?: string;
  rules?: RegisterOptions<T, Path<T>>;
  as?: "input" | "select";
  options?: readonly string[];
  hint?: string;
}) {
  return (
    <div className={authStyles.formGroup}>
      <label className={authStyles.label}>
        <span>{label}</span>
        <span className={authStyles.labelIcon}>
          <Icon size={16} />
        </span>
      </label>
      {as === "select" ? (
        <select
          className={authStyles.select}
          defaultValue=""
          {...register(name, rules)}
        >
          <option value="" disabled>
            {placeholder || "انتخاب کنید"}
          </option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className={authStyles.input}
          placeholder={placeholder}
          {...register(name, rules)}
        />
      )}
      {hint ? <p className={authStyles.formHint}>{hint}</p> : null}
      <FieldError errors={errors} name={name} />
    </div>
  );
}

export default function RoleSignupForm<R extends UserRole>({
  role,
  title,
  subtitle,
  illustrationIcon,
}: RoleSignupFormProps<R>) {
  type Values = FormByRole[R];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: Values) => {
    try {
      setLoading(true);
      // Frontend-only for now — payload shaped for a future API
      void data;
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("ثبت‌نام با موفقیت انجام شد. اکنون می‌توانید وارد شوید.");
    } catch {
      toast.error("خطایی رخ داده است.");
    } finally {
      setLoading(false);
    }
  };

  const typedRegister = register as UseFormRegister<Values>;
  const typedErrors = errors as FieldErrors<Values>;

  return (
    <SignupAuthShell
      title={title}
      subtitle={subtitle}
      backHref="/signup"
      backLabel="بازگشت به انتخاب نقش"
      wide
      illustrationIcon={illustrationIcon}
      footer={
        <p className={authStyles.switchText}>
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/login" className={authStyles.switchLink}>
            وارد شوید
          </Link>
        </p>
      }
    >
      <form className={authStyles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={authStyles.formRow}>
          <TextField
            label="نام"
            icon={User}
            name={"firstName" as Path<Values>}
            register={typedRegister}
            errors={typedErrors}
            placeholder="نام"
            rules={{
              required: "نام الزامی است.",
              minLength: { value: 2, message: "نام خیلی کوتاه است." },
            }}
          />
          <TextField
            label="نام خانوادگی"
            icon={User}
            name={"lastName" as Path<Values>}
            register={typedRegister}
            errors={typedErrors}
            placeholder="نام خانوادگی"
            rules={{
              required: "نام خانوادگی الزامی است.",
              minLength: { value: 2, message: "نام خانوادگی خیلی کوتاه است." },
            }}
          />
        </div>

        <TextField
          label="شماره موبایل"
          icon={Phone}
          name={"phone" as Path<Values>}
          register={typedRegister}
          errors={typedErrors}
          type="tel"
          placeholder="09123456789"
          rules={{
            required: "شماره موبایل الزامی است.",
            pattern: {
              value: phonePattern,
              message: "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).",
            },
          }}
        />

        <TextField
          label="ایمیل"
          icon={Mail}
          name={"email" as Path<Values>}
          register={typedRegister}
          errors={typedErrors}
          type="email"
          placeholder="example@mail.com"
          rules={{ required: "ایمیل الزامی است." }}
        />

        <TextField
          label="رمز عبور"
          icon={Lock}
          name={"password" as Path<Values>}
          register={typedRegister}
          errors={typedErrors}
          type="password"
          placeholder="********"
          rules={{
            required: "رمز عبور الزامی است.",
            minLength: {
              value: 6,
              message: "رمز عبور باید حداقل ۶ کاراکتر باشد.",
            },
          }}
        />

        {role === "doctor" ? (
          <>
            <TextField
              label="تخصص"
              icon={BriefcaseMedical}
              name={"expertise" as Path<Values>}
              register={typedRegister}
              errors={typedErrors}
              as="select"
              options={DOCTOR_EXPERTISE_OPTIONS}
              placeholder="تخصص خود را انتخاب کنید"
              rules={{ required: "انتخاب تخصص الزامی است." }}
            />
            <TextField
              label="شماره نظام پزشکی"
              icon={BadgeCheck}
              name={"medicalLicenseNumber" as Path<Values>}
              register={typedRegister}
              errors={typedErrors}
              placeholder="مثلاً ۱۲۳۴۵۶"
              hint="برای تأیید هویت پزشک، شماره نظام پزشکی شما بررسی می‌شود."
              rules={{
                required: "شماره نظام پزشکی الزامی است.",
                minLength: {
                  value: 4,
                  message: "شماره نظام پزشکی معتبر نیست.",
                },
              }}
            />
          </>
        ) : null}

        {role === "secretary" || role === "patient_existing" ? (
          <TextField
            label={
              role === "secretary" ? "کد معرف پزشک" : "کد معرف / ارجاع پزشک"
            }
            icon={KeyRound}
            name={"doctorReferralCode" as Path<Values>}
            register={typedRegister}
            errors={typedErrors}
            placeholder="کد دریافتی از پزشک"
            hint={
              role === "secretary"
                ? "این کد مشخص می‌کند منشی کدام پزشک هستید."
                : "با این کد، حساب شما به پزشک مربوطه متصل می‌شود."
            }
            rules={{
              required: "کد معرف الزامی است.",
              minLength: { value: 4, message: "کد معرف معتبر نیست." },
            }}
          />
        ) : null}

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
    </SignupAuthShell>
  );
}
