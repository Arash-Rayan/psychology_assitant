import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { DoctorBlogPostPage } from '@/components/DoctorBlogPostPage';
import {
  getDoctorBlog,
  getPublicDoctors,
} from '@/constants/publicDoctors';

type PageProps = {
  params: { slug: string; blogSlug: string };
};

export function generateStaticParams() {
  return getPublicDoctors().flatMap((doctor) =>
    doctor.blogs.map((blog) => ({
      slug: doctor.slug,
      blogSlug: blog.slug,
    })),
  );
}

export function generateMetadata({ params }: PageProps): Metadata {
  const result = getDoctorBlog(params.slug, params.blogSlug);
  if (!result) {
    return { title: 'مقاله یافت نشد | روانصد' };
  }
  const { doctor, blog } = result;
  const title = `${blog.title} | ${doctor.nameFa} — روانصد`;
  return {
    title,
    description: blog.excerpt,
    openGraph: {
      title,
      description: blog.excerpt,
      type: 'article',
    },
  };
}

export default function DoctorBlogPage({ params }: PageProps) {
  const result = getDoctorBlog(params.slug, params.blogSlug);
  if (!result) notFound();

  return (
    <>
      <Header />
      <DoctorBlogPostPage doctor={result.doctor} blog={result.blog} />
    </>
  );
}
