import {
  Stethoscope,
  ClipboardList,
  UserPlus,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types/user";

export type SignupRoleOption = {
  id: UserRole;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export const SIGNUP_ROLE_OPTIONS: SignupRoleOption[] = [
  {
    id: "doctor",
    title: "پزشک / درمانگر",
    description: "ثبت‌نام با شماره نظام پزشکی و تخصص",
    href: "/signup/doctor",
    icon: Stethoscope,
  },
  {
    id: "secretary",
    title: "منشی مطب",
    description: "ثبت‌نام با کد معرف پزشک مربوطه",
    href: "/signup/secretary",
    icon: ClipboardList,
  },
  {
    id: "patient_new",
    title: "مراجع جدید",
    description: "هنوز پزشک مشخصی ندارید؟ از اینجا شروع کنید",
    href: "/signup/patient/new",
    icon: UserPlus,
  },
  {
    id: "patient_existing",
    title: "مراجع فعلی یک پزشک",
    description: "قبلاً مراجع یک درمانگر بوده‌اید؟ با کد معرف او ثبت‌نام کنید",
    href: "/signup/patient/existing",
    icon: UserCheck,
  },
];
