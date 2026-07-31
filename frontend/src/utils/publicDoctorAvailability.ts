import type { PublicDoctor } from '@/types/publicDoctor';
import {
  BOOKING_TIMES,
  buildWeekColumns,
  loadClientBookings,
  resolveSlotStatus,
  startOfIranWeek,
  toLocalYmd,
  type ClientBookingRecord,
} from '@/utils/clientBookingSchedule';

export type NextAvailableSlot = {
  doctorId: string;
  dateYmd: string;
  time: string;
  /** مثلاً: دوشنبه ۲۲ تیر · ۱۰:۰۰ */
  labelFa: string;
  /** فاصله تقریبی تا نوبت برای مرتب‌سازی */
  sortKey: string;
};

function formatSlotLabelFa(dateYmd: string, time: string): string {
  const [y, m, d] = dateYmd.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString('fa-IR', { weekday: 'long' });
  const dayMonth = date.toLocaleDateString('fa-IR', {
    month: 'short',
    day: 'numeric',
  });
  const [hh, mm] = time.split(':');
  const timeFa = `${Number(hh).toLocaleString('fa-IR')}:${mm}`;
  return `${weekday} ${dayMonth} · ${timeFa}`;
}

/** اولین نوبت آزاد در چند هفته آینده (بدون وابستگی به DOM؛ رزروهای localStorage اختیاری). */
export function getNextAvailableSlot(
  doctorId: string,
  options?: {
    weeksAhead?: number;
    clientBookings?: ClientBookingRecord[];
    now?: Date;
  },
): NextAvailableSlot | null {
  const now = options?.now ?? new Date();
  const todayYmd = toLocalYmd(now);
  const weeksAhead = options?.weeksAhead ?? 3;
  const clientBookings = options?.clientBookings ?? [];
  let weekStart = startOfIranWeek(now);

  for (let w = 0; w < weeksAhead; w++) {
    const columns = buildWeekColumns(weekStart);
    for (const col of columns) {
      if (col.ymd < todayYmd) continue;
      for (const time of BOOKING_TIMES) {
        const status = resolveSlotStatus(
          doctorId,
          col.ymd,
          time,
          clientBookings,
          todayYmd,
        );
        if (status !== 'available') continue;
        return {
          doctorId,
          dateYmd: col.ymd,
          time,
          labelFa: formatSlotLabelFa(col.ymd, time),
          sortKey: `${col.ymd}T${time}`,
        };
      }
    }
    weekStart = new Date(weekStart);
    weekStart.setDate(weekStart.getDate() + 7);
  }
  return null;
}

export function getNextAvailableSlotClient(doctorId: string): NextAvailableSlot | null {
  return getNextAvailableSlot(doctorId, {
    clientBookings: loadClientBookings(),
  });
}

export type DoctorWithAvailability = {
  doctor: PublicDoctor;
  nextSlot: NextAvailableSlot | null;
};

export function attachAvailability(
  doctors: PublicDoctor[],
  clientBookings?: ClientBookingRecord[],
): DoctorWithAvailability[] {
  return doctors.map((doctor) => ({
    doctor,
    nextSlot: doctor.bookingDoctorId
      ? getNextAvailableSlot(doctor.bookingDoctorId, { clientBookings })
      : null,
  }));
}

/** نگرانی‌های پرتقاضا برای فیلتر سریع فهرست */
export const CONCERN_FILTERS = [
  { id: 'anxiety', label: 'اضطراب و خلق', keywords: ['اضطراب', 'افسردگی', 'خلق', 'CBT'] },
  { id: 'couples', label: 'زوج و خانواده', keywords: ['زوج', 'خانواده', 'ارتباط', 'اعتماد'] },
  { id: 'trauma', label: 'تروما و سوگ', keywords: ['تروما', 'سوگ', 'PTSD', 'استرس'] },
  { id: 'child', label: 'کودک و نوجوان', keywords: ['کودک', 'نوجوان', 'مدرسه', 'ADHD'] },
] as const;

export type ConcernFilterId = (typeof CONCERN_FILTERS)[number]['id'] | 'all';

export function doctorMatchesConcern(
  doctor: PublicDoctor,
  concernId: ConcernFilterId,
): boolean {
  if (concernId === 'all') return true;
  const filter = CONCERN_FILTERS.find((c) => c.id === concernId);
  if (!filter) return true;
  const hay = [
    doctor.specialtyFa,
    doctor.title,
    doctor.shortBio,
    ...doctor.specialties,
    ...doctor.approaches,
  ].join(' ');
  return filter.keywords.some((k) => hay.includes(k));
}

export function bookingHref(doctor: PublicDoctor): string {
  return doctor.bookingDoctorId
    ? `/dashboard/appointment-booking?doctorId=${doctor.bookingDoctorId}`
    : '/dashboard/appointment-booking';
}
