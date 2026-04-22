'use client';

import { Header } from '@/components/Header';
import { TherapistDashboard } from '@/components/TherapistDashboard';

export default function FormsPatientsListPage() {
  return (
    <>
      <Header />
      <TherapistDashboard initialTab="forms" initialShowSessionNotes />
    </>
  );
}
