'use client';

import { Header } from '@/components/Header';
import { TherapistDashboard } from '@/components/TherapistDashboard';

export default function FormsPage() {
  return (
    <>
      <Header />
      <TherapistDashboard initialTab="forms" />
    </>
  );
}
