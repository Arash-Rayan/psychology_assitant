'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Star,
  MapPin,
  Building2,
  GraduationCap,
  Languages,
  Sparkles,
  Camera,
  Calendar,
  MessageCircle,
  Instagram,
  Linkedin,
  Send,
  Globe,
  Youtube,
  Play,
  FileText,
  Quote,
  CalendarClock,
  Share2,
  Check,
  Gift,
} from 'lucide-react';
import { toast } from 'sonner';
import type { PublicDoctor } from '@/types/publicDoctor';
import {
  bookingHref,
  getNextAvailableSlotClient,
  type NextAvailableSlot,
} from '@/utils/publicDoctorAvailability';
import styles from './DoctorProfilePage.module.css';

function youtubeEmbed(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace('/', '');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    const id = u.searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

function StarRow({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' }) {
  const full = Math.round(value);
  return (
    <span
      className={`${styles.stars} ${size === 'md' ? styles.starsMd : ''}`}
      aria-label={`امتیاز ${value} از ۵`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={i < full ? styles.starFilled : styles.starEmpty}
          fill={i < full ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  );
}

function Portrait({ doctor }: { doctor: PublicDoctor }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !doctor.imageSrc || failed;

  return (
    <div
      className={styles.portrait}
      style={{ '--accent': doctor.accent } as React.CSSProperties}
    >
      {showPlaceholder ? (
        <div className={styles.portraitPlaceholder}>
          <Camera />
          <span>تصویر به‌زودی</span>
        </div>
      ) : (
        <Image
          src={doctor.imageSrc!}
          alt={doctor.nameFa}
          fill
          priority
          className={styles.portraitImg}
          sizes="(max-width: 768px) 100vw, 420px"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function ClinicGallery({ doctor }: { doctor: PublicDoctor }) {
  if (doctor.clinicImages.length === 0) {
    return (
      <div className={styles.galleryGrid}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={styles.galleryPlaceholder}
            style={{ '--accent': doctor.accent } as React.CSSProperties}
          >
            <Camera />
            <span>تصویر کلینیک</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.galleryGrid}>
      {doctor.clinicImages.map((src) => (
        <div key={src} className={styles.galleryItem}>
          <Image
            src={src}
            alt={`کلینیک ${doctor.clinicName}`}
            fill
            className={styles.galleryImg}
            sizes="400px"
          />
        </div>
      ))}
    </div>
  );
}

function ShareProfileButton({ doctor }: { doctor: PublicDoctor }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/doctors/${doctor.slug}`
        : `/doctors/${doctor.slug}`;
    const title = doctor.seoTitle;
    const text = `${doctor.nameFa} — ${doctor.title} در روانصد`;

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
    } catch {
      /* cancelled or failed — try clipboard */
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('لینک پروفایل کپی شد');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('کپی لینک ممکن نشد');
    }
  };

  return (
    <button type="button" className={styles.shareBtn} onClick={share}>
      {copied ? <Check /> : <Share2 />}
      {copied ? 'کپی شد' : 'اشتراک‌گذاری پروفایل'}
    </button>
  );
}

const SOCIAL_ICONS = {
  instagram: Instagram,
  linkedin: Linkedin,
  telegram: Send,
  website: Globe,
  youtube: Youtube,
} as const;

const SOCIAL_LABELS: Record<keyof typeof SOCIAL_ICONS, string> = {
  instagram: 'اینستاگرام',
  linkedin: 'لینکدین',
  telegram: 'تلگرام',
  website: 'وب‌سایت',
  youtube: 'یوتیوب',
};

export function DoctorProfilePage({ doctor }: { doctor: PublicDoctor }) {
  const embed = youtubeEmbed(doctor.videoUrl);
  const socialEntries = (
    Object.entries(doctor.social) as [keyof typeof SOCIAL_ICONS, string][]
  ).filter(([, url]) => Boolean(url));
  const bookUrl = bookingHref(doctor);
  const [nextSlot, setNextSlot] = useState<NextAvailableSlot | null>(null);

  useEffect(() => {
    if (!doctor.bookingDoctorId) return;
    setNextSlot(getNextAvailableSlotClient(doctor.bookingDoctorId));
  }, [doctor.bookingDoctorId]);

  return (
    <div
      className={styles.container}
      dir="rtl"
      style={{ '--accent': doctor.accent } as React.CSSProperties}
    >
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.topBar}>
            <Link href="/doctors" className={styles.backLink}>
              <ArrowRight />
              بازگشت به فهرست درمانگران
            </Link>
            <ShareProfileButton doctor={doctor} />
          </div>

          <div className={styles.heroGrid}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Portrait doctor={doctor} />
            </motion.div>

            <motion.div
              className={styles.heroText}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              <p className={styles.eyebrow}>{doctor.specialtyFa}</p>
              <h1 className={styles.name}>{doctor.nameFa}</h1>
              {doctor.nameEn && <p className={styles.nameEn}>{doctor.nameEn}</p>}
              <p className={styles.role}>{doctor.title}</p>
              <p className={styles.lead}>{doctor.shortBio}</p>

              <div className={styles.heroMeta}>
                <span className={styles.ratingBlock}>
                  <StarRow value={doctor.ratingAverage} size="md" />
                  <strong>{doctor.ratingAverage.toLocaleString('fa-IR')}</strong>
                  <span>
                    از {doctor.ratingCount.toLocaleString('fa-IR')} نظر
                  </span>
                </span>
                <span className={styles.metaChip}>
                  <MapPin />
                  {doctor.city}
                </span>
                <span className={styles.metaChip}>
                  <Sparkles />
                  {doctor.yearsExperience.toLocaleString('fa-IR')} سال تجربه
                </span>
              </div>

              {nextSlot && (
                <div className={styles.nextSlotCard}>
                  <div className={styles.nextSlotInfo}>
                    <CalendarClock />
                    <div>
                      <strong>نزدیک‌ترین نوبت آزاد</strong>
                      <p>{nextSlot.labelFa}</p>
                    </div>
                  </div>
                  <Link href={bookUrl} className={styles.nextSlotCta}>
                    رزرو همین نوبت
                  </Link>
                </div>
              )}

              <div className={styles.offerBanner}>
                <Gift />
                <span>
                  شروع آسان: جلسه اول ارزیابی برای آشنایی با مسیر درمان — بدون
                  تعهد طولانی‌مدت.
                </span>
              </div>

              <div className={styles.ctaRow}>
                <Link href={bookUrl} className={styles.primaryCta}>
                  <Calendar />
                  رزرو نوبت
                </Link>
                <Link href="/chat/pre-consult" className={styles.secondaryCta}>
                  <MessageCircle />
                  گفتگوی پیش از مشاوره
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2>درباره درمانگر</h2>
            <p>معرفی، تحصیلات و رویکردهای درمانی</p>
          </div>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutCard}>
              <p className={styles.fullBio}>{doctor.fullBio}</p>
            </div>
            <div className={styles.infoStack}>
              <div className={styles.infoCard}>
                <h3>
                  <GraduationCap />
                  تحصیلات
                </h3>
                <ul>
                  {doctor.education.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.infoCard}>
                <h3>
                  <Sparkles />
                  رویکردها
                </h3>
                <ul>
                  {doctor.approaches.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.infoCard}>
                <h3>
                  <Languages />
                  زبان‌ها
                </h3>
                <ul>
                  {doctor.languages.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.tags}>
            {doctor.specialties.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="clinic">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2>
              <Building2 />
              کلینیک
            </h2>
            <p>
              {doctor.clinicName} — {doctor.city}
            </p>
          </div>
          <ClinicGallery doctor={doctor} />
        </div>
      </section>

      {(embed || socialEntries.length > 0) && (
        <section className={styles.section} id="media">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <h2>ویدیو و شبکه‌های اجتماعی</h2>
              <p>آشنایی بیشتر با فضای کار و محتوای عمومی درمانگر</p>
            </div>
            <div className={styles.mediaGrid}>
              {embed && (
                <div className={styles.videoWrap}>
                  <div className={styles.videoFrame}>
                    <iframe
                      src={embed}
                      title={`ویدیو معرفی ${doctor.nameFa}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className={styles.videoHint}>
                    <Play />
                    ویدیو معرفی
                  </p>
                </div>
              )}
              {socialEntries.length > 0 && (
                <div className={styles.socialList}>
                  {socialEntries.map(([key, url]) => {
                    const Icon = SOCIAL_ICONS[key];
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        <Icon />
                        <span>{SOCIAL_LABELS[key]}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className={styles.section} id="reviews">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2>نظرات و امتیاز</h2>
            <p>
              میانگین{' '}
              <strong>{doctor.ratingAverage.toLocaleString('fa-IR')}</strong> از ۵
              بر اساس {doctor.ratingCount.toLocaleString('fa-IR')} نظر
            </p>
          </div>
          <div className={styles.reviewsGrid}>
            {doctor.reviews.map((review) => (
              <article key={review.id} className={styles.reviewCard}>
                <Quote className={styles.quoteIcon} />
                <div className={styles.reviewTop}>
                  <StarRow value={review.rating} />
                  <time>{review.date}</time>
                </div>
                <p className={styles.reviewComment}>{review.comment}</p>
                <p className={styles.reviewAuthor}>{review.authorName}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {doctor.blogs.length > 0 && (
        <section className={styles.section} id="blogs">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <h2>
                <FileText />
                مقالات
              </h2>
              <p>محتوای تخصصی از این درمانگر برای آگاهی و سئو</p>
            </div>
            <div className={styles.blogsGrid}>
              {doctor.blogs.map((blog) => (
                <Link
                  key={blog.slug}
                  href={`/doctors/${doctor.slug}/blog/${blog.slug}`}
                  className={styles.blogCard}
                >
                  <h3>{blog.title}</h3>
                  <p>{blog.excerpt}</p>
                  <div className={styles.blogMeta}>
                    <span>{blog.publishedAt}</span>
                    <span>
                      {blog.readingMinutes.toLocaleString('fa-IR')} دقیقه مطالعه
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.bottomCta}>
        <div className={styles.bottomCtaInner}>
          <h2>آماده شروع هستید؟</h2>
          <p>
            {nextSlot
              ? `نزدیک‌ترین نوبت آزاد: ${nextSlot.labelFa}. همین الان رزرو کنید یا اول با گفتگوی کوتاه شروع کنید.`
              : `نوبت خود را با ${doctor.nameFa} رزرو کنید یا از گفتگوی هوشمند پیش از مشاوره استفاده کنید.`}
          </p>
          <div className={styles.ctaRow}>
            <Link href={bookUrl} className={styles.primaryCta}>
              <Calendar />
              رزرو نوبت
            </Link>
            <Link href="/doctors" className={styles.secondaryCtaLight}>
              سایر درمانگران
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.stickyBar} aria-label="اقدام سریع">
        <div className={styles.stickyInner}>
          <div className={styles.stickyInfo}>
            <strong>{doctor.nameFa}</strong>
            {nextSlot ? (
              <span>نوبت بعدی: {nextSlot.labelFa}</span>
            ) : (
              <span>{doctor.title}</span>
            )}
          </div>
          <div className={styles.stickyActions}>
            <Link href={bookUrl} className={styles.stickyBook}>
              رزرو نوبت
            </Link>
            <ShareProfileButton doctor={doctor} />
          </div>
        </div>
      </div>
    </div>
  );
}
