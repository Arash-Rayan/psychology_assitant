import type { Doctor, ScheduleSlot, SlotStatus } from "@/types/clinic";

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function formatYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const HOURS_START = 9;
const HOURS_END = 17;
const SLOT_MINUTES = 30;

function hashStatus(seed: string): SlotStatus {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const r = h % 10;
  if (r < 4) return "available";
  if (r < 7) return "booked";
  return "unavailable";
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function timeStr(h: number, m: number): string {
  return `${pad(h)}:${pad(m)}`;
}

function addMinutes(t: string, mins: number): string {
  const [hh, mm] = t.split(":").map(Number);
  const total = hh * 60 + mm + mins;
  return timeStr(Math.floor(total / 60) % 24, total % 60);
}

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Sara Ahmadi",
    nameFa: "دکتر سارا احمدی",
    specialty: "Clinical Psychology",
    specialtyFa: "روانشناسی بالینی",
    yearsExperience: 12,
    bio: "Focus on anxiety, mood, and life transitions using evidence-based CBT approaches.",
    bioFa: "تمرکز بر اضطراب، خلق‌وخو و گذارهای زندگی با رویکرد شناختی-رفتاری.",
    imageColor: "#7dd3c0",
  },
  {
    id: "d2",
    name: "Dr. Arman Hosseini",
    nameFa: "دکتر آرمان حسینی",
    specialty: "Couples & Family Therapy",
    specialtyFa: "زوج‌درمانی و خانواده‌درمانی",
    yearsExperience: 9,
    bio: "Helps couples and families improve communication and rebuild trust.",
    bioFa: "به زوج‌ها و خانواده‌ها برای بهبود ارتباط و بازسازی اعتماد کمک می‌کند.",
    imageColor: "#93c5fd",
  },
  {
    id: "d3",
    name: "Dr. Leila Karimi",
    nameFa: "دکتر لیلا کریمی",
    specialty: "Trauma-Informed Care",
    specialtyFa: "مراقبت آگاه از تروما",
    yearsExperience: 15,
    bio: "Gentle, paced work with PTSD, grief, and chronic stress.",
    bioFa: "کار ملایم و مرحله‌ای با اختلال استرس پس از سانحه، سوگ و استرس مزمن.",
    imageColor: "#c4b5fd",
  },
  {
    id: "d4",
    name: "Dr. Kourosh Minaei",
    nameFa: "دکتر کوروش مینایی",
    specialty: "Child & Adolescent Psychology",
    specialtyFa: "روانشناسی کودک و نوجوان",
    yearsExperience: 11,
    bio: "Supports young people with school stress, ADHD patterns, and emotional regulation.",
    bioFa: "همراهی کودکان و نوجوانان در استرس مدرسه، الگوهای ADHD و تنظیم هیجان.",
    imageColor: "#fcd34d",
  },
];

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id);
}

/** Slots for `weekOffset` from today (0 = current week start Monday) × `weekCount` weeks */
export function buildMockSchedule(
  weekOffset = 0,
  weekCount = 2,
): ScheduleSlot[] {
  const slots: ScheduleSlot[] = [];
  const today = new Date();
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = addDays(today, mondayOffset + weekOffset * 7);

  for (let w = 0; w < weekCount; w++) {
    for (let weekday = 0; weekday < 5; weekday++) {
      const date = addDays(monday, w * 7 + weekday);
      const ymd = formatYmd(date);
      if (ymd < formatYmd(today)) continue;

      for (const doc of doctors) {
        for (let h = HOURS_START; h < HOURS_END; h++) {
          for (const m of [0, SLOT_MINUTES]) {
            if (h === HOURS_END - 1 && m === SLOT_MINUTES) continue;
            const start = timeStr(h, m);
            const end = addMinutes(start, SLOT_MINUTES);
            const seed = `${doc.id}-${ymd}-${start}`;
            const status = hashStatus(seed);
            slots.push({
              id: `${doc.id}-${ymd}-${start}`,
              doctorId: doc.id,
              date: ymd,
              start,
              end,
              status,
            });
          }
        }
      }
    }
  }

  return slots;
}

export const allScheduleSlots: ScheduleSlot[] = buildMockSchedule(0, 3);

export function slotsForDoctorOnDate(
  doctorId: string,
  dateYmd: string,
): ScheduleSlot[] {
  return allScheduleSlots
    .filter((s) => s.doctorId === doctorId && s.date === dateYmd)
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function slotsForDate(dateYmd: string): ScheduleSlot[] {
  return allScheduleSlots.filter((s) => s.date === dateYmd);
}

export function suggestDoctorFromConcern(concern: string): {
  doctorId: string;
  reason: string;
} {
  const t = concern.toLowerCase();
  if (/child|kid|teen|adolescent|school|نوجوان|کودک/.test(t)) {
    return {
      doctorId: "d4",
      reason:
        "Your description points to developmental or school-related stress — our child & adolescent specialist is the closest fit.",
    };
  }
  if (/couple|marriage|family|partner|زوج|خانواده/.test(t)) {
    return {
      doctorId: "d2",
      reason:
        "Relationship and family dynamics are central — a couples & family therapist can provide structured support.",
    };
  }
  if (/trauma|ptsd|grief|loss|تروما|سوگ/.test(t)) {
    return {
      doctorId: "d3",
      reason:
        "Themes of trauma or deep loss benefit from a trauma-informed, paced approach.",
    };
  }
  return {
    doctorId: "d1",
    reason:
      "For general anxiety, mood, and adjustment concerns, our clinical psychologist is a strong first match.",
  };
}
