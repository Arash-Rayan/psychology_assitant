"use client";

import { ClipboardList } from "lucide-react";
import RoleSignupForm from "@/components/signup/RoleSignupForm";

export default function SecretarySignupPage() {
  return (
    <RoleSignupForm
      role="secretary"
      title="ثبت‌نام منشی مطب"
      subtitle="کد معرف پزشک را وارد کنید تا بدانیم منشی کدام درمانگر هستید."
      illustrationIcon={ClipboardList}
    />
  );
}
