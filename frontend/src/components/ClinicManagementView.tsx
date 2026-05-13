"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  ClipboardCheck,
  User,
  ChevronRight,
  ChevronLeft,
  CalendarSearch,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ClinicalEngagement, PatientDetail } from "./PatientDetailView";
import styles from "./ClinicManagementView.module.css";
import { doctors } from "@/utils/mockClinicData";
import {
  loadClinicRooms,
  newRoomId,
  saveClinicRooms,
} from "@/utils/clinicRoomsStorage";
import type { ClinicRoom, Doctor } from "@/types/clinic";
import {
  loadCustomDoctors,
  newDoctorId,
  saveCustomDoctors,
} from "@/utils/clinicDoctorsStorage";

interface SchedulerSlot {
  dateYmd: string;
  time: string;
  patientId?: string;
  patientName?: string;
  clinicalEngagement?: ClinicalEngagement;
}

export interface WeekColumn {
  ymd: string;
  dayName: string;
  dateLabel: string;
}

interface ClinicManagementViewProps {
  patients: PatientDetail[];
  onPatientClick: (patientId: string) => void;
}

const DAY_NAMES_FA = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه'];

const TIMES = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

/** شنبه = first column; JS: Saturday = 6 */
function startOfIranWeek(anchor: Date): Date {
  const x = new Date(anchor);
  const day = x.getDay();
  const daysSinceSat = day === 6 ? 0 : day + 1;
  x.setDate(x.getDate() - daysSinceSat);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, n: number): Date {
  const t = new Date(d);
  t.setDate(t.getDate() + n);
  return t;
}

function parseLocalYmd(ymd: string): Date {
  const [y, m, day] = ymd.split("-").map(Number);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(day)) {
    return new Date(NaN);
  }
  return new Date(y, m - 1, day);
}

/** هر روز بین دو تاریخ محلی (شامل خودِ دو سر بازه). */
function enumerateYmdInclusive(fromYmd: string, toYmd: string): string[] {
  const a = parseLocalYmd(fromYmd);
  const b = parseLocalYmd(toYmd);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return [];
  const start = a <= b ? a : b;
  const end = a <= b ? b : a;
  const out: string[] = [];
  for (let cur = new Date(start); cur <= end; cur = addDays(cur, 1)) {
    out.push(toLocalYmd(cur));
  }
  return out;
}

const OVERVIEW_CALENDAR_KEY = "ALL_DOCTORS:ALL_ROOMS";

interface AvailabilityReportRow {
  id: string;
  title: string;
  freeSlots: number;
}

interface AvailabilityReport {
  fromYmd: string;
  toYmd: string;
  rangeLabelFa: string;
  totalFreeSlots: number;
  rooms: AvailabilityReportRow[];
  doctors: AvailabilityReportRow[];
}

function buildAvailabilityReport(
  patients: PatientDetail[],
  clinicRooms: ClinicRoom[],
  allDoctors: Doctor[],
  fromYmd: string,
  toYmd: string,
): AvailabilityReport | null {
  const from = parseLocalYmd(fromYmd);
  const to = parseLocalYmd(toYmd);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;

  const lanes = buildVisibleLanes(clinicRooms, allDoctors, "", "");
  if (!lanes.length) {
    return {
      fromYmd,
      toYmd,
      rangeLabelFa: "",
      totalFreeSlots: 0,
      rooms: [],
      doctors: [],
    };
  }

  const roomMap = new Map<string, { title: string; n: number }>();
  const doctorMap = new Map<string, { title: string; n: number }>();

  let totalFree = 0;

  for (const ymd of enumerateYmdInclusive(fromYmd, toYmd)) {
    const weekStart = startOfIranWeek(parseLocalYmd(ymd));
    const weekColumns = buildWeekColumns(weekStart);
    if (!weekColumns.some((c) => c.ymd === ymd)) continue;

    for (const lane of lanes) {
      const slots = createSchedule(
        patients,
        weekColumns,
        `${OVERVIEW_CALENDAR_KEY}:${lane.id}`,
      );
      for (const time of TIMES) {
        const slot = slots.find((s) => s.dateYmd === ymd && s.time === time);
        if (slot && !slot.patientId) {
          totalFree += 1;
          const docTitle = lane.doctor.nameFa?.trim() || lane.doctor.name;
          const prevD = doctorMap.get(lane.doctor.id);
          doctorMap.set(lane.doctor.id, {
            title: docTitle,
            n: (prevD?.n ?? 0) + 1,
          });
          if (lane.room) {
            const prevR = roomMap.get(lane.room.id);
            roomMap.set(lane.room.id, {
              title: lane.room.name.trim() || "اتاق",
              n: (prevR?.n ?? 0) + 1,
            });
          }
        }
      }
    }
  }

  const d0 = parseLocalYmd(fromYmd <= toYmd ? fromYmd : toYmd);
  const d1 = parseLocalYmd(fromYmd <= toYmd ? toYmd : fromYmd);
  const rangeLabelFa = `${d0.toLocaleDateString("fa-IR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })} تا ${d1.toLocaleDateString("fa-IR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;

  const roomRows = [...roomMap.entries()]
    .map(([id, v]) => ({ id, title: v.title, freeSlots: v.n }))
    .filter((r) => r.freeSlots > 0)
    .sort((a, b) => b.freeSlots - a.freeSlots);

  const doctorRows = [...doctorMap.entries()]
    .map(([id, v]) => ({ id, title: v.title, freeSlots: v.n }))
    .filter((r) => r.freeSlots > 0)
    .sort((a, b) => b.freeSlots - a.freeSlots);

  return {
    fromYmd: fromYmd <= toYmd ? fromYmd : toYmd,
    toYmd: fromYmd <= toYmd ? toYmd : fromYmd,
    rangeLabelFa,
    totalFreeSlots: totalFree,
    rooms: roomRows,
    doctors: doctorRows,
  };
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** Local calendar date (matches DayPicker), avoids UTC shift from toISOString */
function toLocalYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildWeekColumns(weekStart: Date): WeekColumn[] {
  return DAY_NAMES_FA.map((dayName, i) => {
    const dt = addDays(weekStart, i);
    const ymd = toLocalYmd(dt);
    const dateLabel = dt.toLocaleDateString('fa-IR', {
      day: 'numeric',
      month: 'short',
    });
    return { ymd, dayName, dateLabel };
  });
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function createSchedule(
  patients: PatientDetail[],
  weekColumns: WeekColumn[],
  calendarKey: string,
): SchedulerSlot[] {
  if (!patients.length) {
    return weekColumns.flatMap(({ ymd }) =>
      TIMES.map((time) => ({ dateYmd: ymd, time })),
    );
  }

  const shuffled = [...patients].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  );
  const slots: SchedulerSlot[] = [];
  let patientIndex = hashSeed(calendarKey) % shuffled.length;

  for (const { ymd } of weekColumns) {
    for (const time of TIMES) {
      const shouldFill = hashSeed(`${calendarKey}-${ymd}-${time}`) % 3 !== 0;
      if (shouldFill && patientIndex < shuffled.length * 8) {
        const patient = shuffled[patientIndex % shuffled.length]!;
        slots.push({
          dateYmd: ymd,
          time,
          patientId: patient.id,
          patientName: patient.name,
          clinicalEngagement: patient.clinicalEngagement,
        });
        patientIndex += 1;
      } else {
        slots.push({ dateYmd: ymd, time });
      }
    }
  }

  return slots;
}

/** How each calendar cell should describe آزاد / اشغال based on active filters. */
type CellFilterMode = "overview" | "room" | "doctor" | "both";

function cellFilterModeFromFilters(
  filterDoctorId: string,
  filterRoomId: string,
  doctor: Doctor | undefined,
  room: ClinicRoom | undefined,
): CellFilterMode {
  const hasD = Boolean(filterDoctorId && doctor);
  const hasR = Boolean(filterRoomId && room);
  if (hasD && hasR) return "both";
  if (hasR) return "room";
  if (hasD) return "doctor";
  return "overview";
}

function calendarCellContextLine(
  mode: CellFilterMode,
  room: ClinicRoom | undefined,
  doctor: Doctor | undefined,
  kind: "free" | "occupied",
): string | null {
  if (mode === "overview") return null;
  const roomName = room?.name?.trim() || "اتاق";
  const doctorName = doctor?.nameFa?.trim() || "درمانگر";
  if (kind === "free") {
    if (mode === "room") return `${roomName} · آزاد`;
    if (mode === "doctor") return `${doctorName} · آزاد`;
    return `${doctorName} · ${roomName} · آزاد`;
  }
  if (mode === "room") return `اشغال · ${roomName}`;
  if (mode === "doctor") return `اشغال · ${doctorName}`;
  return `اشغال · ${doctorName} · ${roomName}`;
}

/** One schedulable row: a physical room (with assigned doctor) or a bare doctor if no rooms yet. */
interface ScheduleLane {
  id: string;
  room: ClinicRoom | null;
  doctor: Doctor;
}

function buildVisibleLanes(
  rooms: ClinicRoom[],
  allDoctors: Doctor[],
  filterDoctorId: string,
  filterRoomId: string,
): ScheduleLane[] {
  const docMatches = (d: Doctor) =>
    !filterDoctorId || d.id === filterDoctorId;
  const roomMatches = (r: ClinicRoom) =>
    !filterRoomId || r.id === filterRoomId;

  if (rooms.length > 0) {
    const out: ScheduleLane[] = [];
    for (const room of rooms.filter(roomMatches)) {
      const doctor =
        allDoctors.find((x) => x.id === room.doctorId) ?? allDoctors[0];
      if (doctor && docMatches(doctor)) {
        out.push({ id: `room:${room.id}`, room, doctor });
      }
    }
    return out;
  }

  return allDoctors.filter(docMatches).map((doctor) => ({
    id: `doctor:${doctor.id}`,
    room: null,
    doctor,
  }));
}

/** When several resource rows are visible, lane labels carry room/doctor — skip duplicate lines in cells. */
function cellModeForLaneGrid(
  laneCount: number,
  baseMode: CellFilterMode,
): CellFilterMode {
  if (laneCount > 1) return "overview";
  return baseMode;
}

export function ClinicManagementView({
  patients,
  onPatientClick,
}: ClinicManagementViewProps) {
  const [customDoctors, setCustomDoctors] = useState<Doctor[]>([]);
  const [rooms, setRooms] = useState<ClinicRoom[]>([]);
  /** Empty string = no filter (all doctors / all rooms). */
  const [filterDoctorId, setFilterDoctorId] = useState("");
  const [filterRoomId, setFilterRoomId] = useState("");
  const [newDoctorNameFa, setNewDoctorNameFa] = useState("");
  const [newDoctorSpecialtyFa, setNewDoctorSpecialtyFa] = useState("");
  const [newDoctorYearsExperience, setNewDoctorYearsExperience] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [newRoomDoctorId, setNewRoomDoctorId] = useState("");
  const [weekAnchor, setWeekAnchor] = useState(() => startOfIranWeek(new Date()));
  const [monthAnchor, setMonthAnchor] = useState(() => startOfMonth(new Date()));
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [rangeFromYmd, setRangeFromYmd] = useState(() => toLocalYmd(new Date()));
  const [rangeToYmd, setRangeToYmd] = useState(() =>
    toLocalYmd(addDays(new Date(), 13)),
  );
  const [availabilityReport, setAvailabilityReport] =
    useState<AvailabilityReport | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  useEffect(() => {
    const syncRooms = () => {
      const nextCustomDoctors = loadCustomDoctors();
      setCustomDoctors(nextCustomDoctors);
      const next = loadClinicRooms();
      setRooms(next);
      setFilterRoomId((prev) =>
        prev && next.some((room) => room.id === prev) ? prev : "",
      );
      setNewRoomDoctorId((prev) =>
        prev || !nextCustomDoctors.length
          ? prev || doctors[0]?.id || ""
          : nextCustomDoctors[0]?.id || doctors[0]?.id || "",
      );
    };
    syncRooms();
    window.addEventListener("storage", syncRooms);
    return () => window.removeEventListener("storage", syncRooms);
  }, []);

  const allDoctors = useMemo(() => [...doctors, ...customDoctors], [customDoctors]);

  const filteredRoom = useMemo(
    () => (filterRoomId ? rooms.find((room) => room.id === filterRoomId) : undefined),
    [rooms, filterRoomId],
  );

  const filteredDoctor = useMemo(
    () =>
      filterDoctorId ? allDoctors.find((doctor) => doctor.id === filterDoctorId) : undefined,
    [allDoctors, filterDoctorId],
  );

  const weekColumns = useMemo(
    () => buildWeekColumns(weekAnchor),
    [weekAnchor],
  );

  const visibleLanes = useMemo(
    () => buildVisibleLanes(rooms, allDoctors, filterDoctorId, filterRoomId),
    [rooms, allDoctors, filterDoctorId, filterRoomId],
  );

  /** Mock schedule seed: encodes doctor-only, room-only, both, or clinic overview. */
  const calendarKey = useMemo(() => {
    const docPart = filterDoctorId || "ALL_DOCTORS";
    const roomPart = filterRoomId || "ALL_ROOMS";
    return `${docPart}:${roomPart}`;
  }, [filterDoctorId, filterRoomId]);

  const cellFilterMode = useMemo(
    () =>
      cellFilterModeFromFilters(
        filterDoctorId,
        filterRoomId,
        filteredDoctor,
        filteredRoom,
      ),
    [filterDoctorId, filterRoomId, filteredDoctor, filteredRoom],
  );

  const filterHint = useMemo(() => {
    if (!filterDoctorId && !filterRoomId) {
      if (visibleLanes.length > 1) {
        return "نمای چند سطره: هر بلوک سطرها متعلق به یک اتاق و درمانگر اختصاصی آن است. با «همه درمانگران / همه اتاق‌ها» همه اتاق‌ها را هم‌زمان می‌بینید؛ برای کار با یک منبع، از منوها فیلتر کنید.";
      }
      return "نمای کلی: هر سلول فقط بیمار و زمان را نشان می‌دهد. برای دیدن اشغال بودن یک اتاق یا یک درمانگر، از منوهای بالا یکی یا هر دو را انتخاب کنید.";
    }
    if (filterDoctorId && filterRoomId && filteredDoctor && filteredRoom) {
      return `در حال نمایش: ${filteredDoctor.nameFa} در ${filteredRoom.name} — سلول‌های اشغال هر دو را با برچسب «اشغال · درمانگر · اتاق» نشان می‌دهند.`;
    }
    if (filterDoctorId && filteredDoctor) {
      return `در حال نمایش: ${filteredDoctor.nameFa} — سلول‌ها نشان می‌دهند این درمانگر در آن زمان با بیمار اشغال است یا آزاد.`;
    }
    if (filterRoomId && filteredRoom) {
      const roomDoctor = allDoctors.find((d) => d.id === filteredRoom.doctorId);
      return roomDoctor
        ? `در حال نمایش: ${filteredRoom.name} — سلول‌ها نشان می‌دهند همین اتاق در آن زمان اشغال است یا آزاد (${roomDoctor.nameFa}).`
        : `در حال نمایش: ${filteredRoom.name} — سلول‌ها وضعیت اشغال همین اتاق را نشان می‌دهند.`;
    }
    return "در حال نمایش تقویم با فیلتر انتخاب‌شده.";
  }, [
    filterDoctorId,
    filterRoomId,
    filteredDoctor,
    filteredRoom,
    allDoctors,
    visibleLanes.length,
  ]);

  const laneSchedules = useMemo(() => {
    return visibleLanes.map((lane) => ({
      lane,
      slots: createSchedule(
        patients,
        weekColumns,
        `${calendarKey}:${lane.id}`,
      ),
    }));
  }, [visibleLanes, patients, weekColumns, calendarKey]);

  const occupiedCount = laneSchedules.reduce(
    (acc, { slots }) => acc + slots.filter((s) => s.patientId).length,
    0,
  );
  const totalSlotCount = laneSchedules.reduce(
    (acc, { slots }) => acc + slots.length,
    0,
  );
  const freeCount = totalSlotCount - occupiedCount;
  const newPatientCount = laneSchedules.reduce(
    (acc, { slots }) =>
      acc +
      slots.filter(
        (s) => s.patientId && s.clinicalEngagement === "new_intake",
      ).length,
    0,
  );
  const establishedPatientCount = occupiedCount - newPatientCount;

  const laneGridCellMode = useMemo(
    () =>
      cellModeForLaneGrid(visibleLanes.length, cellFilterMode),
    [visibleLanes.length, cellFilterMode],
  );

  const weekRangeLabel = useMemo(() => {
    const start = weekColumns[0]?.ymd;
    const end = weekColumns[5]?.ymd;
    if (!start || !end) return "";
    const d0 = new Date(start + "T12:00:00");
    const d1 = new Date(end + "T12:00:00");
    const a = d0.toLocaleDateString('fa-IR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const b = d1.toLocaleDateString('fa-IR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return `${a} تا ${b}`;
  }, [weekColumns]);

  const shiftWeek = (delta: number) => {
    setWeekAnchor((prev) => addDays(prev, delta * 7));
  };

  const monthLabel = useMemo(
    () =>
      monthAnchor.toLocaleDateString("fa-IR", {
        month: "long",
        year: "numeric",
      }),
    [monthAnchor],
  );

  const monthWeeks = useMemo(() => {
    const monthStart = startOfMonth(monthAnchor);
    const monthEnd = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + 1, 0);
    const firstWeekStart = startOfIranWeek(monthStart);
    const starts: Date[] = [];
    let cursor = firstWeekStart;
    while (cursor <= monthEnd && starts.length < 4) {
      starts.push(new Date(cursor));
      cursor = addDays(cursor, 7);
    }
    return starts;
  }, [monthAnchor]);

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <CalendarClock />
          <h3>مدیریت کلینیک و برنامه جلسات</h3>
        </div>
        <div className={styles.badges}>
          <span className={styles.badge}>
            <ClipboardCheck />
            {occupiedCount} زمان رزرو شده
          </span>
          <span className={styles.badge}>
            <User />
            {freeCount} زمان آزاد
          </span>
          <span className={styles.badge}>
            <span className={styles.legendDotNew} aria-hidden />
            {newPatientCount} مراجع جدید
          </span>
          <span className={styles.badge}>
            <span className={styles.legendDotEstablished} aria-hidden />
            {establishedPatientCount} مراجع قدیمی
          </span>
        </div>
      </div>

      <div className={styles.weekToolbar}>
        <span className={styles.weekToolbarLabel}>انتخاب هفته</span>
        <div className={styles.defineGrid}>
          <section className={styles.defineCard}>
            <h4 className={styles.defineCardTitle}>تعریف درمانگر</h4>
            <div className={styles.defineFields}>
              <input
                className={styles.defineInput}
                placeholder="نام درمانگر (فارسی)"
                value={newDoctorNameFa}
                onChange={(e) => setNewDoctorNameFa(e.target.value)}
              />
              <input
                className={styles.defineInput}
                placeholder="تخصص (مثلاً CBT)"
                value={newDoctorSpecialtyFa}
                onChange={(e) => setNewDoctorSpecialtyFa(e.target.value)}
              />
              <input
                className={styles.defineInput}
                placeholder="سال تجربه (اختیاری)"
                inputMode="numeric"
                value={newDoctorYearsExperience}
                onChange={(e) => setNewDoctorYearsExperience(e.target.value)}
              />
              <button
                type="button"
                className={styles.defineButton}
                onClick={() => {
                  const nameFa = newDoctorNameFa.trim();
                  const specialtyFa = newDoctorSpecialtyFa.trim();
                  if (!nameFa || !specialtyFa) return;
                  const years = Number.parseInt(newDoctorYearsExperience, 10);
                  const nextDoctor: Doctor = {
                    id: newDoctorId(),
                    name: nameFa,
                    nameFa,
                    specialty: specialtyFa,
                    specialtyFa,
                    yearsExperience: Number.isFinite(years) ? years : 0,
                    bio: "Doctor added by clinic manager.",
                    bioFa: "درمانگر افزوده‌شده توسط مدیر کلینیک.",
                    imageColor: "#a7f3d0",
                  };
                  const updated = [...customDoctors, nextDoctor];
                  setCustomDoctors(updated);
                  saveCustomDoctors(updated);
                  setNewRoomDoctorId(nextDoctor.id);
                  setNewDoctorNameFa("");
                  setNewDoctorSpecialtyFa("");
                  setNewDoctorYearsExperience("");
                }}
              >
                افزودن درمانگر
              </button>
            </div>
          </section>

          <section className={styles.defineCard}>
            <h4 className={styles.defineCardTitle}>تعریف اتاق</h4>
            <div className={styles.defineFields}>
              <select
                className={styles.defineInput}
                value={newRoomDoctorId}
                onChange={(e) => setNewRoomDoctorId(e.target.value)}
              >
                {allDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.nameFa}
                  </option>
                ))}
              </select>
              <input
                className={styles.defineInput}
                placeholder="نام اتاق"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <input
                className={styles.defineInput}
                placeholder="توضیح کوتاه اتاق (یک خط)"
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
              />
              <button
                type="button"
                className={styles.defineButton}
                onClick={() => {
                  const roomName = newRoomName.trim();
                  const doctorId = newRoomDoctorId || allDoctors[0]?.id;
                  if (!roomName || !doctorId) return;
                  const nextRoom: ClinicRoom = {
                    id: newRoomId(),
                    name: roomName,
                    description: newRoomDescription.trim() || undefined,
                    doctorId,
                  };
                  const updatedRooms = [...rooms, nextRoom];
                  setRooms(updatedRooms);
                  saveClinicRooms(updatedRooms);
                  setFilterRoomId(nextRoom.id);
                  setNewRoomName("");
                  setNewRoomDescription("");
                }}
              >
                افزودن اتاق
              </button>
            </div>
          </section>
        </div>
        <p className={styles.filterSectionTitle}>درمانگر و اتاق</p>
        <div className={styles.filterRow}>
          <div className={styles.roomPicker}>
            <label htmlFor="doctor-filter" className={styles.roomPickerLabel}>
              درمانگر
            </label>
            <select
              id="doctor-filter"
              className={styles.roomPickerSelect}
              value={filterDoctorId}
              onChange={(e) => setFilterDoctorId(e.target.value)}
              disabled={!allDoctors.length}
            >
              <option value="">همه درمانگران</option>
              {allDoctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.nameFa}
                  {doc.specialtyFa ? ` — ${doc.specialtyFa}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.roomPicker}>
            <label htmlFor="room-filter" className={styles.roomPickerLabel}>
              اتاق
            </label>
            <select
              id="room-filter"
              className={styles.roomPickerSelect}
              value={filterRoomId}
              onChange={(e) => setFilterRoomId(e.target.value)}
              disabled={!rooms.length}
            >
              {!rooms.length ? (
                <option value="">ابتدا اتاق تعریف کنید</option>
              ) : (
                <option value="">همه اتاق‌ها</option>
              )}
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                  {room.description ? ` (${room.description})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.freeReportRow}>
          <button
            type="button"
            className={styles.freeReportButton}
            onClick={() => {
              setAvailabilityOpen(true);
              setAvailabilityReport(null);
              setAvailabilityError(null);
            }}
          >
            <CalendarSearch aria-hidden />
            گزارش ظرفیت آزاد در بازه
          </button>
        </div>
        <p className={styles.roomPickerHint}>{filterHint}</p>
        <div className={styles.weekToolbarActions}>
          <div className={styles.monthWeekPicker}>
            <div className={styles.monthWeekHeader}>
              <button
                type="button"
                className={styles.monthShiftButton}
                onClick={() => setMonthAnchor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                aria-label="ماه بعد"
              >
                <ChevronRight className={styles.weekNavIcon} aria-hidden />
              </button>
              <span className={styles.monthWeekLabel}>{monthLabel}</span>
              <button
                type="button"
                className={styles.monthShiftButton}
                onClick={() => setMonthAnchor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                aria-label="ماه قبل"
              >
                <ChevronLeft className={styles.weekNavIcon} aria-hidden />
              </button>
            </div>
            <div className={styles.monthWeekButtons}>
              {monthWeeks.map((wStart, idx) => {
                const active = toLocalYmd(startOfIranWeek(weekAnchor)) === toLocalYmd(wStart);
                return (
                  <button
                    key={toLocalYmd(wStart)}
                    type="button"
                    onClick={() => setWeekAnchor(wStart)}
                    className={active ? styles.monthWeekButtonActive : styles.monthWeekButton}
                  >
                    هفته {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className={styles.weekNavButton}
            onClick={() => shiftWeek(1)}
            aria-label="هفته بعد"
          >
            <ChevronRight className={styles.weekNavIcon} aria-hidden />
            هفته بعد
          </button>
          <button
            type="button"
            className={styles.weekNavButtonPrimary}
            onClick={() => setWeekAnchor(startOfIranWeek(new Date()))}
          >
            همین هفته
          </button>
          <button
            type="button"
            className={styles.weekNavButton}
            onClick={() => shiftWeek(-1)}
            aria-label="هفته قبل"
          >
            هفته قبل
            <ChevronLeft className={styles.weekNavIcon} aria-hidden />
          </button>
        </div>
        <p className={styles.weekRange}>{weekRangeLabel}</p>
      </div>

      <Dialog open={availabilityOpen} onOpenChange={setAvailabilityOpen}>
        <DialogContent
          className="max-w-[calc(100%-1.5rem)] sm:max-w-xl"
          dir="rtl"
        >
          <DialogHeader className="text-right sm:text-right">
            <DialogTitle>گزارش زمان‌های آزاد</DialogTitle>
            <DialogDescription className="text-right">
              بازهٔ تاریخ را انتخاب کنید. برای هر روزِ داخل بازه (همان روزهای شنبه تا
              پنجشنبهٔ همین تقویم) و هر ساعتِ جدول، همان منطقِ نمای کلی تقویم شمارش
              می‌شود؛ این اعداد از رزروهای واقعی پایگاه داده نیستند، فقط از مدل
              نمایشی همین صفحه. روز جمعه در این تقویم لحاظ نشده است.
            </DialogDescription>
          </DialogHeader>
          <div className={styles.availabilityModalFields}>
            <div className={styles.availabilityModalField}>
              <label htmlFor="avail-from" className={styles.availabilityModalLabel}>
                از تاریخ
              </label>
              <input
                id="avail-from"
                type="date"
                className={styles.availabilityModalInput}
                value={rangeFromYmd}
                onChange={(e) => setRangeFromYmd(e.target.value)}
              />
            </div>
            <div className={styles.availabilityModalField}>
              <label htmlFor="avail-to" className={styles.availabilityModalLabel}>
                تا تاریخ
              </label>
              <input
                id="avail-to"
                type="date"
                className={styles.availabilityModalInput}
                value={rangeToYmd}
                onChange={(e) => setRangeToYmd(e.target.value)}
              />
            </div>
            {availabilityError ? (
              <p className={styles.availabilityModalError}>{availabilityError}</p>
            ) : null}
          </div>
          {availabilityReport ? (
            <>
              <p className={styles.availabilityModalSummary}>
                بازه: {availabilityReport.rangeLabelFa} — مجموعاً{" "}
                <strong>{availabilityReport.totalFreeSlots}</strong> نوبت آزاد
                (جمع روزها و ساعت‌های همان مدل نمایشی).
              </p>
              <div className={styles.availabilityModalColumns}>
                <div className={styles.availabilityModalListCard}>
                  <h5 className={styles.availabilityModalListTitle}>اتاق‌های دارای زمان آزاد</h5>
                  {availabilityReport.rooms.length ? (
                    <ul className={styles.availabilityModalList}>
                      {availabilityReport.rooms.map((row) => (
                        <li key={row.id} className={styles.availabilityModalListItem}>
                          <span>{row.title}</span>
                          <span className={styles.availabilityModalBadge}>
                            {row.freeSlots} نوبت آزاد
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.availabilityModalEmpty}>
                      {rooms.length
                        ? "در این بازه هیچ اتاقی نوبت آزاد ندارد (یا همهٔ نوبت‌ها اشغال‌اند)."
                        : "اتاقی تعریف نشده؛ فقط درمانگران (بدون اتاق اختصاصی) در ستون کنار بررسی شده‌اند."}
                    </p>
                  )}
                </div>
                <div className={styles.availabilityModalListCard}>
                  <h5 className={styles.availabilityModalListTitle}>درمانگران دارای زمان آزاد</h5>
                  {availabilityReport.doctors.length ? (
                    <ul className={styles.availabilityModalList}>
                      {availabilityReport.doctors.map((row) => (
                        <li key={row.id} className={styles.availabilityModalListItem}>
                          <span>{row.title}</span>
                          <span className={styles.availabilityModalBadge}>
                            {row.freeSlots} نوبت آزاد
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.availabilityModalEmpty}>
                      در این بازه هیچ درمانگری زمان آزاد ندارد.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : null}
          <div className={styles.availabilityModalFooter}>
            <button
              type="button"
              className={styles.availabilityModalCancel}
              onClick={() => setAvailabilityOpen(false)}
            >
              بستن
            </button>
            <button
              type="button"
              className={styles.availabilityModalSubmit}
              onClick={() => {
                const from = parseLocalYmd(rangeFromYmd);
                const to = parseLocalYmd(rangeToYmd);
                if (
                  !rangeFromYmd ||
                  !rangeToYmd ||
                  Number.isNaN(from.getTime()) ||
                  Number.isNaN(to.getTime())
                ) {
                  setAvailabilityError("لطفاً هر دو تاریخ را درست انتخاب کنید.");
                  setAvailabilityReport(null);
                  return;
                }
                const span =
                  Math.ceil(
                    Math.abs(to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000),
                  ) + 1;
                if (span > 120) {
                  setAvailabilityError(
                    "برای سرعت بهتر، بازه را حداکثر ۱۲۰ روز انتخاب کنید.",
                  );
                  setAvailabilityReport(null);
                  return;
                }
                const report = buildAvailabilityReport(
                  patients,
                  rooms,
                  allDoctors,
                  rangeFromYmd,
                  rangeToYmd,
                );
                if (!report) {
                  setAvailabilityError("محاسبهٔ گزارش ممکن نشد.");
                  setAvailabilityReport(null);
                  return;
                }
                setAvailabilityError(null);
                setAvailabilityReport(report);
              }}
            >
              نمایش گزارش
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className={styles.gridWrapper}>
        {visibleLanes.length === 0 ? (
          <p className={styles.emptyCalendarState}>
            اتاق یا درمانگری برای نمایش وجود ندارد. ابتدا از بخش بالا اتاق یا درمانگر
            تعریف کنید یا فیلترها را گسترش دهید.
          </p>
        ) : (
          <div
            className={styles.grid}
            style={{
              gridTemplateRows: `auto repeat(${visibleLanes.length * TIMES.length}, minmax(46px, auto))`,
            }}
          >
            <div className={styles.cornerCell} style={{ gridColumn: 1, gridRow: 1 }}>
              اتاق · درمانگر
            </div>
            <div className={styles.cornerCell} style={{ gridColumn: 2, gridRow: 1 }}>
              ساعت
            </div>
            {weekColumns.map((col, di) => (
              <div
                key={col.ymd}
                className={styles.dayHeader}
                style={{ gridColumn: 3 + di, gridRow: 1 }}
              >
                <span className={styles.dayHeaderName}>{col.dayName}</span>
                <span className={styles.dayHeaderDate}>{col.dateLabel}</span>
                <span className={styles.dayHeaderGregorian} dir="ltr">
                  {col.ymd}
                </span>
              </div>
            ))}

            {visibleLanes.flatMap((lane, li) =>
              TIMES.map((time, ti) => {
                const row = 2 + li * TIMES.length + ti;
                const slots = laneSchedules[li]?.slots ?? [];
                const laneRoom = lane.room ?? undefined;
                const freeLine = calendarCellContextLine(
                  laneGridCellMode,
                  laneRoom,
                  lane.doctor,
                  "free",
                );
                const occupiedLine = calendarCellContextLine(
                  laneGridCellMode,
                  laneRoom,
                  lane.doctor,
                  "occupied",
                );

                return (
                  <Fragment key={`${lane.id}-${time}`}>
                    {ti === 0 ? (
                      <div
                        className={styles.laneLabelCell}
                        style={{
                          gridColumn: 1,
                          gridRow: `${row} / span ${TIMES.length}`,
                        }}
                      >
                        <span className={styles.laneLabelRoom}>
                          {lane.room?.name ?? "بدون اتاق"}
                        </span>
                        <span className={styles.laneLabelDoctor}>{lane.doctor.nameFa}</span>
                      </div>
                    ) : null}
                    <div
                      className={styles.timeCell}
                      style={{ gridColumn: 2, gridRow: row }}
                    >
                      {time}
                    </div>
                    {weekColumns.map((col, di) => {
                      const cellSlot = slots.find(
                        (s) => s.dateYmd === col.ymd && s.time === time,
                      );
                      if (!cellSlot?.patientId) {
                        return (
                          <div
                            key={`${lane.id}-${col.ymd}-${time}`}
                            className={styles.emptyCell}
                            style={{ gridColumn: 3 + di, gridRow: row }}
                          >
                            <span className={styles.emptyCellMain}>آزاد</span>
                            {freeLine ? (
                              <span className={styles.cellFilterLine}>{freeLine}</span>
                            ) : null}
                          </div>
                        );
                      }
                      const isNew = cellSlot.clinicalEngagement === "new_intake";
                      return (
                        <button
                          key={`${lane.id}-${col.ymd}-${time}`}
                          type="button"
                          className={
                            isNew ? styles.occupiedCellNew : styles.occupiedCellEstablished
                          }
                          style={{ gridColumn: 3 + di, gridRow: row }}
                          onClick={() => onPatientClick(cellSlot.patientId!)}
                        >
                          <span className={styles.occupiedBadge}>
                            {isNew ? "جدید" : "پرونده"}
                          </span>
                          <span className={styles.occupiedName}>{cellSlot.patientName}</span>
                          {occupiedLine ? (
                            <span className={styles.cellFilterLine}>{occupiedLine}</span>
                          ) : null}
                          <span className={styles.occupiedMeta}>
                            {col.dayName} · {col.dateLabel} · {time}
                          </span>
                        </button>
                      );
                    })}
                  </Fragment>
                );
              }),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
