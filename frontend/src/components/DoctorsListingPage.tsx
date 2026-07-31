'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Stethoscope,
  Star,
  MapPin,
  ArrowLeft,
  Search,
  Camera,
  CalendarClock,
  MessageCircle,
  Zap,
  Filter,
} from 'lucide-react';
import { getPublicDoctors } from '@/constants/publicDoctors';
import type { PublicDoctor } from '@/types/publicDoctor';
import {
  attachAvailability,
  bookingHref,
  CONCERN_FILTERS,
  doctorMatchesConcern,
  type ConcernFilterId,
  type NextAvailableSlot,
} from '@/utils/publicDoctorAvailability';
import { loadClientBookings } from '@/utils/clientBookingSchedule';
import styles from './DoctorsListingPage.module.css';

type SortMode = 'recommended' | 'soonest' | 'rating';

function DoctorPhoto({ doctor }: { doctor: PublicDoctor }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !doctor.imageSrc || failed;

  return (
    <div
      className={styles.cardPhoto}
      style={{ '--accent': doctor.accent } as React.CSSProperties}
    >
      {showPlaceholder ? (
        <div className={styles.photoPlaceholder}>
          <Camera />
          <span>{doctor.nameFa.split(' ').slice(-1)[0]}</span>
        </div>
      ) : (
        <Image
          src={doctor.imageSrc!}
          alt={doctor.nameFa}
          fill
          className={styles.photoImg}
          sizes="(max-width: 640px) 70vw, 280px"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function StarRow({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className={styles.stars} aria-label={`امتیاز ${value} از ۵`}>
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

export function DoctorsListingPage() {
  const doctors = useMemo(() => getPublicDoctors(), []);
  const [query, setQuery] = useState('');
  const [concern, setConcern] = useState<ConcernFilterId>('all');
  const [sort, setSort] = useState<SortMode>('recommended');
  const [availability, setAvailability] = useState<
    Map<string, NextAvailableSlot | null>
  >(() => new Map());

  useEffect(() => {
    const bookings = loadClientBookings();
    const rows = attachAvailability(doctors, bookings);
    setAvailability(
      new Map(rows.map((r) => [r.doctor.slug, r.nextSlot] as const)),
    );
  }, [doctors]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = doctors.filter((d) => doctorMatchesConcern(d, concern));
    if (q) {
      list = list.filter(
        (d) =>
          d.nameFa.includes(query.trim()) ||
          d.specialtyFa.includes(query.trim()) ||
          d.city.includes(query.trim()) ||
          d.specialties.some((s) => s.includes(query.trim())) ||
          (d.nameEn?.toLowerCase().includes(q) ?? false),
      );
    }

    const withSlot = list.map((doctor) => ({
      doctor,
      nextSlot: availability.get(doctor.slug) ?? null,
    }));

    withSlot.sort((a, b) => {
      if (sort === 'rating') {
        return b.doctor.ratingAverage - a.doctor.ratingAverage;
      }
      if (sort === 'soonest') {
        if (a.nextSlot && b.nextSlot) {
          return a.nextSlot.sortKey.localeCompare(b.nextSlot.sortKey);
        }
        if (a.nextSlot) return -1;
        if (b.nextSlot) return 1;
        return 0;
      }
      // recommended: soon slot + rating
      const score = (row: (typeof withSlot)[number]) => {
        const rating = row.doctor.ratingAverage;
        const soonBonus = row.nextSlot ? 2 : 0;
        return rating + soonBonus;
      };
      return score(b) - score(a);
    });

    return withSlot;
  }, [doctors, query, concern, sort, availability]);

  const soonestPreview = useMemo(() => {
    return [...filtered]
      .filter((r) => r.nextSlot)
      .sort((a, b) =>
        (a.nextSlot?.sortKey ?? '').localeCompare(b.nextSlot?.sortKey ?? ''),
      )
      .slice(0, 3);
  }, [filtered]);

  return (
    <div className={styles.container} dir="rtl">
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroHeader}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className={styles.badge}>
              <Stethoscope />
              شبکه درمانگران روانصد
            </span>
            <h1 className={styles.title}>
              درمانگر مناسب را پیدا کنید،
              <span className={styles.titlePrimary}> نوبت بگیرید</span>
            </h1>
            <p className={styles.subtitle}>
              بر اساس نگرانی‌تان فیلتر کنید، نزدیک‌ترین نوبت آزاد را ببینید و
              مستقیم رزرو کنید — یا با گفتگوی کوتاه، درمانگر پیشنهادی بگیرید.
            </p>
          </motion.div>

          <div className={styles.matchBanner}>
            <div className={styles.matchText}>
              <Zap />
              <div>
                <strong>نمی‌دانید از کجا شروع کنید؟</strong>
                <p>
                  در گفتگوی پیش از مشاوره، نگرانی‌تان را بگویید تا درمانگر
                  مناسب پیشنهاد شود.
                </p>
              </div>
            </div>
            <Link href="/chat/pre-consult" className={styles.matchCta}>
              <MessageCircle />
              شروع گفتگوی هوشمند
            </Link>
          </div>

          <div className={styles.filtersBlock}>
            <div className={styles.concernRow} role="group" aria-label="فیلتر نگرانی">
              <button
                type="button"
                className={`${styles.concernChip} ${concern === 'all' ? styles.concernChipActive : ''}`}
                onClick={() => setConcern('all')}
              >
                همه
              </button>
              {CONCERN_FILTERS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.concernChip} ${concern === c.id ? styles.concernChipActive : ''}`}
                  onClick={() => setConcern(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className={styles.searchSortRow}>
              <div className={styles.searchWrap}>
                <Search className={styles.searchIcon} />
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder="جستجو بر اساس نام، تخصص یا شهر…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="جستجوی درمانگر"
                />
              </div>
              <label className={styles.sortWrap}>
                <Filter />
                <select
                  className={styles.sortSelect}
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortMode)}
                  aria-label="مرتب‌سازی"
                >
                  <option value="recommended">پیشنهادی</option>
                  <option value="soonest">نزدیک‌ترین نوبت</option>
                  <option value="rating">بیشترین امتیاز</option>
                </select>
              </label>
            </div>
          </div>

          {soonestPreview.length > 0 && sort !== 'soonest' && (
            <div className={styles.soonStrip}>
              <div className={styles.soonStripHead}>
                <CalendarClock />
                <span>نوبت‌های نزدیک — سریع‌تر شروع کنید</span>
              </div>
              <div className={styles.soonStripList}>
                {soonestPreview.map(({ doctor, nextSlot }) => (
                  <Link
                    key={doctor.slug}
                    href={bookingHref(doctor)}
                    className={styles.soonChip}
                    style={{ '--accent': doctor.accent } as React.CSSProperties}
                  >
                    <span className={styles.soonName}>{doctor.nameFa}</span>
                    <span className={styles.soonTime}>{nextSlot?.labelFa}</span>
                    <span className={styles.soonBook}>رزرو</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <motion.div
            className={styles.grid}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {filtered.map(({ doctor, nextSlot }) => (
              <motion.div
                key={doctor.slug}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <article
                  className={styles.card}
                  style={{ '--accent': doctor.accent } as React.CSSProperties}
                >
                  <Link href={`/doctors/${doctor.slug}`} className={styles.cardLink}>
                    <DoctorPhoto doctor={doctor} />
                    <div className={styles.cardBody}>
                      {nextSlot && (
                        <span className={styles.nextSlotBadge}>
                          <CalendarClock />
                          نزدیک‌ترین نوبت: {nextSlot.labelFa}
                        </span>
                      )}
                      <h2 className={styles.cardName}>{doctor.nameFa}</h2>
                      <p className={styles.cardTitle}>{doctor.title}</p>
                      <p className={styles.cardBio}>{doctor.shortBio}</p>
                      <div className={styles.cardMeta}>
                        <span className={styles.rating}>
                          <StarRow value={doctor.ratingAverage} />
                          <span>
                            {doctor.ratingAverage.toLocaleString('fa-IR')} (
                            {doctor.ratingCount.toLocaleString('fa-IR')} نظر)
                          </span>
                        </span>
                        <span className={styles.city}>
                          <MapPin />
                          {doctor.city}
                        </span>
                      </div>
                      <div className={styles.tags}>
                        {doctor.specialties.slice(0, 3).map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className={styles.cardCta}>
                        مشاهده پروفایل
                        <ArrowLeft />
                      </span>
                    </div>
                  </Link>
                  <div className={styles.cardActions}>
                    <Link href={bookingHref(doctor)} className={styles.bookBtn}>
                      رزرو نوبت
                    </Link>
                    <Link
                      href={`/doctors/${doctor.slug}`}
                      className={styles.profileBtn}
                    >
                      جزئیات
                    </Link>
                  </div>
                </article>
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <p className={styles.empty}>درمانگری با این فیلتر پیدا نشد.</p>
          )}
        </div>
      </section>
    </div>
  );
}
