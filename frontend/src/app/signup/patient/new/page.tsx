"use client";

import { UserPlus } from "lucide-react";
import RoleSignupForm from "@/components/signup/RoleSignupForm";

export default function NewPatientSignupPage() {
  return (
    <RoleSignupForm
      role="patient_new"
      title="ثبت‌نام مراجع جدید"
      subtitle="اگر هنوز پزشک مشخصی ندارید یا از طریق اینترنت با ما آشنا شده‌اید، از اینجا شروع کنید."
      illustrationIcon={UserPlus}
    />
  );
}
