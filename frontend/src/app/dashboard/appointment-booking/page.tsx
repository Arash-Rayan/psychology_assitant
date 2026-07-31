"use client";

import { TherapistDashboard } from "@/components/TherapistDashboard";
import { Header } from "@/components/Header";

export default function AppointmentBookingDashboardPage() {
  return (
    <>
      <Header />
      <TherapistDashboard initialTab="appointment-booking" />
    </>
  );
}
