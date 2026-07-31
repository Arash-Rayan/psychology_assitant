"use client";

import { Stethoscope } from "lucide-react";
import RoleSignupForm from "@/components/signup/RoleSignupForm";

export default function DoctorSignupPage() {
  return (
    <RoleSignupForm
      role="doctor"
      title="ثبت‌نام پزشک / درمانگر"
      subtitle="اطلاعات حرفه‌ای و شماره نظام پزشکی خود را وارد کنید تا هویت شما تأیید شود."
      illustrationIcon={Stethoscope}
    />
  );
}
