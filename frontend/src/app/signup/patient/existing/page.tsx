"use client";

import { UserCheck } from "lucide-react";
import RoleSignupForm from "@/components/signup/RoleSignupForm";

export default function ExistingPatientSignupPage() {
  return (
    <RoleSignupForm
      role="patient_existing"
      title="ثبت‌نام مراجع فعلی"
      subtitle="اگر قبلاً مراجع یک پزشک بوده‌اید، پس از پر کردن اطلاعات، کد معرف او را وارد کنید."
      illustrationIcon={UserCheck}
    />
  );
}
