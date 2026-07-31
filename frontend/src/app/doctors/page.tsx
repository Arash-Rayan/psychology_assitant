import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { DoctorsListingPage } from '@/components/DoctorsListingPage';

export const metadata: Metadata = {
  title: 'درمانگران همکار | روانصد',
  description:
    'فهرست پزشکان و درمانگران همکار روانصد؛ معرفی تخصص، کلینیک، نظرات مراجعان و مقالات تخصصی.',
};

export default function DoctorsPage() {
  return (
    <>
      <Header />
      <DoctorsListingPage />
    </>
  );
}
