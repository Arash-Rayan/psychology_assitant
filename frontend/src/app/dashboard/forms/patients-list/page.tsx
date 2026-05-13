'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { TherapistDashboard } from '@/components/TherapistDashboard';

function PatientsListInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const legacyPatient = searchParams.get('patient');

  useEffect(() => {
    if (legacyPatient) {
      router.replace(
        `/dashboard/forms/patients/${encodeURIComponent(legacyPatient)}`,
      );
    }
  }, [legacyPatient, router]);

  if (legacyPatient) {
    return (
      <>
        <Header />
        <div dir="rtl" className="mx-auto max-w-lg px-4 py-16 text-center text-muted-foreground">
          در حال هدایت به صفحهٔ مراجع…
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <TherapistDashboard initialTab="forms" initialShowSessionNotes />
    </>
  );
}

export default function FormsPatientsListPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <div className="mx-auto max-w-lg px-4 py-16 text-center text-muted-foreground" dir="rtl">
            در حال بارگذاری لیست مراجعین…
          </div>
        </>
      }
    >
      <PatientsListInner />
    </Suspense>
  );
}
