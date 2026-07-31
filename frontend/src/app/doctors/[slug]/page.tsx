import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { DoctorProfilePage } from '@/components/DoctorProfilePage';
import {
  getPublicDoctorBySlug,
  getPublicDoctors,
} from '@/constants/publicDoctors';

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getPublicDoctors().map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const doctor = getPublicDoctorBySlug(params.slug);
  if (!doctor) {
    return { title: 'درمانگر یافت نشد | روانصد' };
  }
  return {
    title: doctor.seoTitle,
    description: doctor.seoDescription,
    openGraph: {
      title: doctor.seoTitle,
      description: doctor.seoDescription,
      type: 'profile',
    },
  };
}

export default function DoctorPage({ params }: PageProps) {
  const doctor = getPublicDoctorBySlug(params.slug);
  if (!doctor) notFound();

  return (
    <>
      <Header />
      <DoctorProfilePage doctor={doctor} />
    </>
  );
}
