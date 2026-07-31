import type { Doctor, ScheduleSlot, SlotStatus } from "@/types/clinic";
import { doctors } from "@/utils/mockClinicData";
import { loadCustomDoctors } from "@/utils/clinicDoctorsStorage";

export const BOOKING_DAY_NAMES_FA = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
] as const;

/** هم‌تراز با تقویم مدیریت کلینیک */
export const BOOKING_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

export type BookingWeekColumn = {
  ymd: string;
  dayName: string;
  dateLabel: string;
};

export type ClientBookingRecord = {
  slotId: string;
  doctorId: string;
  dateYmd: string;
  time: string;
  clientName: string;
  clientPhone: string;
  createdAt: number;
};

const BOOKINGS_STORAGE_KEY = "pmh-client-bookings-v1";

function addDays(d: Date, n: number): Date {
  const t = new Date(d);
  t.setDate(t.getDate() + n);
  return t;
}

export function toLocalYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** شنبه = ستون اول؛ JS: Saturday = 6 */
export function startOfIranWeek(anchor: Date): Date {
  const x = new Date(anchor);
  const day = x.getDay();
  const daysSinceSat = day === 6 ? 0 : day + 1;
  x.setDate(x.getDate() - daysSinceSat);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function buildWeekColumns(weekStart: Date): BookingWeekColumn[] {
  return BOOKING_DAY_NAMES_FA.map((dayName, i) => {
    const d = addDays(weekStart, i);
    return {
      ymd: toLocalYmd(d),
      dayName,
      dateLabel: d.toLocaleDateString("fa-IR", {
        month: "short",
        day: "numeric",
      }),
    };
  });
}

function hashStatus(seed: string): SlotStatus {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const r = h % 10;
  if (r < 5) return "available";
  if (r < 8) return "booked";
  return "unavailable";
}

function endTime(start: string): string {
  const [hh, mm] = start.split(":").map(Number);
  const total = hh * 60 + mm + 60;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function getAllBookingDoctors(): Doctor[] {
  return [...doctors, ...loadCustomDoctors()];
}

export function loadClientBookings(): ClientBookingRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is ClientBookingRecord =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as ClientBookingRecord).slotId === "string" &&
        typeof (x as ClientBookingRecord).doctorId === "string" &&
        typeof (x as ClientBookingRecord).dateYmd === "string" &&
        typeof (x as ClientBookingRecord).time === "string" &&
        typeof (x as ClientBookingRecord).clientName === "string" &&
        typeof (x as ClientBookingRecord).clientPhone === "string",
    );
  } catch {
    return [];
  }
}

export function saveClientBookings(bookings: ClientBookingRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  } catch {
    /* ignore */
  }
}

export function addClientBooking(
  booking: Omit<ClientBookingRecord, "createdAt">,
): ClientBookingRecord[] {
  const next = [
    ...loadClientBookings().filter((b) => b.slotId !== booking.slotId),
    { ...booking, createdAt: Date.now() },
  ];
  saveClientBookings(next);
  return next;
}

/** وضعیت پایهٔ نوبت + اعمال رزروهای ثبت‌شده توسط مراجع */
export function resolveSlotStatus(
  doctorId: string,
  dateYmd: string,
  time: string,
  clientBookings: ClientBookingRecord[],
  todayYmd: string,
): SlotStatus {
  const slotId = `${doctorId}-${dateYmd}-${time}`;
  if (clientBookings.some((b) => b.slotId === slotId)) return "booked";
  if (dateYmd < todayYmd) return "unavailable";
  return hashStatus(slotId);
}

export function buildDoctorWeekSlots(
  doctorId: string,
  weekColumns: BookingWeekColumn[],
  clientBookings: ClientBookingRecord[],
  todayYmd: string,
): ScheduleSlot[] {
  const slots: ScheduleSlot[] = [];
  for (const col of weekColumns) {
    for (const time of BOOKING_TIMES) {
      const status = resolveSlotStatus(
        doctorId,
        col.ymd,
        time,
        clientBookings,
        todayYmd,
      );
      slots.push({
        id: `${doctorId}-${col.ymd}-${time}`,
        doctorId,
        date: col.ymd,
        start: time,
        end: endTime(time),
        status,
      });
    }
  }
  return slots;
}
