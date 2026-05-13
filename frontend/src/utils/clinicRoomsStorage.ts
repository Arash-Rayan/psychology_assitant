import type { ClinicRoom } from "@/types/clinic";
import { doctors } from "@/utils/mockClinicData";

const STORAGE_KEY = "pmh-clinic-rooms-v1";

/** وقتی هنوز چیزی ذخیره نشده، یک چیدمان پیش‌فرض برای پیش‌نمایش فوری */
export function defaultClinicRooms(): ClinicRoom[] {
  return doctors.map((d, i) => ({
    id: `room-${d.id}`,
    name: `اتاق ${i + 1}`,
    doctorId: d.id,
  }));
}

export function loadClinicRooms(): ClinicRoom[] {
  if (typeof window === "undefined") return defaultClinicRooms();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultClinicRooms();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return defaultClinicRooms();
    const rooms = parsed.filter(
      (x): x is ClinicRoom =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as ClinicRoom).id === "string" &&
        typeof (x as ClinicRoom).name === "string" &&
        (typeof (x as ClinicRoom).description === "undefined" ||
          typeof (x as ClinicRoom).description === "string") &&
        typeof (x as ClinicRoom).doctorId === "string",
    );
    return rooms.length ? rooms : defaultClinicRooms();
  } catch {
    return defaultClinicRooms();
  }
}

export function saveClinicRooms(rooms: ClinicRoom[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  } catch {
    /* ignore quota */
  }
}

export function newRoomId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `room-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
