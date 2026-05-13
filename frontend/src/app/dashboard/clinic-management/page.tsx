"use client";

import { TherapistDashboard } from "@/components/TherapistDashboard";
import { Header } from "@/components/Header";

/** Opens the therapist dashboard with the «مدیریت کلینیک» tab active (same as header button). */
export default function ClinicManagementDashboardPage() {
  return (
    <>
      <Header />
      <TherapistDashboard initialTab="clinic-management" />
    </>
  );
}
