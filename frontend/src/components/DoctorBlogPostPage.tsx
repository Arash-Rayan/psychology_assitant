'use client';

import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import type { DoctorBlogPost, PublicDoctor } from '@/types/publicDoctor';
import styles from './DoctorBlogPostPage.module.css';

export function DoctorBlogPostPage({
  doctor,
  blog,
}: {
  doctor: PublicDoctor;
  blog: DoctorBlogPost;
}) {
  return (
    <article
      className={styles.container}
      dir="rtl"
      style={{ '--accent': doctor.accent } as React.CSSProperties}
    >
      <div className={styles.inner}>
        <Link href={`/doctors/${doctor.slug}`} className={styles.backLink}>
          <ArrowRight />
          بازگشت به پروفایل {doctor.nameFa}
        </Link>

        <header className={styles.header}>
          <span className={styles.badge}>
            <FileText />
            مقاله تخصصی
          </span>
          <h1>{blog.title}</h1>
          <p className={styles.meta}>
            <Link href={`/doctors/${doctor.slug}`}>{doctor.nameFa}</Link>
            <span>·</span>
            <time>{blog.publishedAt}</time>
            <span>·</span>
            <span>{blog.readingMinutes.toLocaleString('fa-IR')} دقیقه مطالعه</span>
          </p>
        </header>

        <div className={styles.body}>
          {blog.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <footer className={styles.footer}>
          <Link href={`/doctors/${doctor.slug}`} className={styles.profileCta}>
            مشاهده پروفایل {doctor.nameFa}
          </Link>
          <Link href="/doctors" className={styles.listLink}>
            همه درمانگران
          </Link>
        </footer>
      </div>
    </article>
  );
}
