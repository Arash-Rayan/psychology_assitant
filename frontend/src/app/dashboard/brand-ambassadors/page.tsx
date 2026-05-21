"use client";

import { TherapistDashboard } from "@/components/TherapistDashboard";
import { Header } from "@/components/Header";

/** Opens the therapist dashboard with the «سفیران برند» tab active. */
export default function BrandAmbassadorsDashboardPage() {
  return (
    <>
      <Header />
      <TherapistDashboard initialTab="brand-ambassadors" />
    </>
  );
}
