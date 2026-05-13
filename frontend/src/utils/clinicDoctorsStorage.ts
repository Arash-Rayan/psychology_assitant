import type { Doctor } from "@/types/clinic";

const STORAGE_KEY = "pmh-clinic-custom-doctors-v1";

export function loadCustomDoctors(): Doctor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is Doctor =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as Doctor).id === "string" &&
        typeof (x as Doctor).name === "string" &&
        typeof (x as Doctor).nameFa === "string" &&
        typeof (x as Doctor).specialty === "string" &&
        typeof (x as Doctor).specialtyFa === "string" &&
        typeof (x as Doctor).yearsExperience === "number" &&
        typeof (x as Doctor).bio === "string" &&
        typeof (x as Doctor).bioFa === "string" &&
        typeof (x as Doctor).imageColor === "string",
    );
  } catch {
    return [];
  }
}

export function saveCustomDoctors(doctors: Doctor[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
  } catch {
    /* ignore quota */
  }
}

export function newDoctorId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `custom-${crypto.randomUUID()}`;
  }
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
