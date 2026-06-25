'use client';

import { TherapistDashboard } from '@/components/TherapistDashboard';
import { Header } from '@/components/Header';

export default function TestsDashboardPage() {
  return (
    <>
      <Header />
      <TherapistDashboard initialTab="tests" />
    </>
  );
}
