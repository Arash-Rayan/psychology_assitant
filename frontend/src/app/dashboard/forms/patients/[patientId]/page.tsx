'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import {
  generatePatients,
  DEMO_THERAPIST_DATA_SEED,
} from '@/components/generatePatientData';
import { SessionNotesView } from '@/components/SessionNotesView';
import { NewIntakePatientView } from '@/components/NewIntakePatientView';
import { patientDetailToPatient } from '@/utils/patientDetailToPatient';

/** صفحهٔ اختصاصی هر مراجع: یادداشت جلسات + تحلیل AI (پرونده) یا خلاصهٔ ورودی (مراجع جدید) */
export default function PatientWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const raw = params.patientId;
  const slug = Array.isArray(raw) ? raw[0] : raw;
  const patientId = slug ? decodeURIComponent(slug) : '';

  const patientsData = useMemo(
    () => generatePatients(100, DEMO_THERAPIST_DATA_SEED),
    [],
  );

  const detail = useMemo(
    () => patientsData.find((p) => p.id === patientId),
    [patientsData, patientId],
  );

  if (!patientId || !detail) {
    return (
      <>
        <Header />
        <div dir="rtl" className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
          <p className="text-foreground">مراجع با این شناسه یافت نشد.</p>
          <button
            type="button"
            onClick={() => router.push('/dashboard/forms/patients-list')}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50"
          >
            بازگشت به لیست مراجعین
          </button>
        </div>
      </>
    );
  }

  if (detail.clinicalEngagement === 'new_intake') {
    return (
      <>
        <Header />
        <main className="py-8">
          <NewIntakePatientView
            patient={detail}
            embedded
            onClose={() => router.push('/dashboard/forms/patients-list')}
          />
        </main>
      </>
    );
  }

  const card = patientDetailToPatient(detail);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <SessionNotesView
          patients={[card]}
          initialPatientId={patientId}
          standalonePatientId={patientId}
          onBack={() => router.push('/dashboard/forms/patients-list')}
        />
      </main>
    </>
  );
}
