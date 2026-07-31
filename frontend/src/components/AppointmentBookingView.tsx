"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Stethoscope,
  CheckCircle2,
  Ban,
  CircleDot,
  User,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Doctor, ScheduleSlot } from "@/types/clinic";
import {
  BOOKING_TIMES,
  addClientBooking,
  buildDoctorWeekSlots,
  buildWeekColumns,
  getAllBookingDoctors,
  loadClientBookings,
  startOfIranWeek,
  toLocalYmd,
  type ClientBookingRecord,
} from "@/utils/clientBookingSchedule";
import styles from "./AppointmentBookingView.module.css";

const PENDING_BOOKING_KEY = "pmh-pending-booking-v1";

export function AppointmentBookingView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorIdFromUrl = searchParams.get("doctorId");
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [weekAnchor, setWeekAnchor] = useState(() => new Date());
  const [bookings, setBookings] = useState<ClientBookingRecord[]>([]);
  const [pendingSlot, setPendingSlot] = useState<ScheduleSlot | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const list = getAllBookingDoctors();
    setDoctorsList(list);
    setBookings(loadClientBookings());
    if (list.length === 0) return;
    const fromUrl =
      doctorIdFromUrl && list.some((d) => d.id === doctorIdFromUrl)
        ? doctorIdFromUrl
        : null;
    setSelectedDoctorId(fromUrl ?? list[0].id);
  }, [doctorIdFromUrl]);

  const weekStart = useMemo(
    () => startOfIranWeek(weekAnchor),
    [weekAnchor],
  );
  const weekColumns = useMemo(
    () => buildWeekColumns(weekStart),
    [weekStart],
  );
  const todayYmd = useMemo(() => toLocalYmd(new Date()), []);

  const selectedDoctor = doctorsList.find((d) => d.id === selectedDoctorId);

  const slots = useMemo(() => {
    if (!selectedDoctorId) return [];
    return buildDoctorWeekSlots(
      selectedDoctorId,
      weekColumns,
      bookings,
      todayYmd,
    );
  }, [selectedDoctorId, weekColumns, bookings, todayYmd]);

  const weekLabel = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 5);
    return `${weekStart.toLocaleDateString("fa-IR", {
      month: "long",
      day: "numeric",
    })} — ${end.toLocaleDateString("fa-IR", {
      month: "long",
      day: "numeric",
    })}`;
  }, [weekStart]);

  const counts = useMemo(() => {
    const available = slots.filter((s) => s.status === "available").length;
    const booked = slots.filter((s) => s.status === "booked").length;
    return { available, booked };
  }, [slots]);

  const openReserveDialog = (slot: ScheduleSlot) => {
    if (slot.status !== "available") return;
    setPendingSlot(slot);
    setClientName("");
    setClientPhone("");
  };

  const confirmBooking = async () => {
    if (!pendingSlot) return;
    if (!clientName.trim() || !clientPhone.trim()) {
      toast.error("لطفاً نام و شماره تماس را وارد کنید.");
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));

    const next = addClientBooking({
      slotId: pendingSlot.id,
      doctorId: pendingSlot.doctorId,
      dateYmd: pendingSlot.date,
      time: pendingSlot.start,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
    });
    setBookings(next);

    const payload = {
      slotId: pendingSlot.id,
      doctorId: pendingSlot.doctorId,
      dateYmd: pendingSlot.date,
      time: pendingSlot.start,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
    };
    try {
      sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }

    const params = new URLSearchParams({
      from: "booking",
      doctorId: pendingSlot.doctorId,
      slotId: pendingSlot.id,
      date: pendingSlot.date,
      time: pendingSlot.start,
      name: clientName.trim(),
    });

    setSubmitting(false);
    setPendingSlot(null);
    toast.success("نوبت ثبت شد. در حال انتقال به پیش‌مشاوره...");
    router.push(`/chat/pre-consult?${params.toString()}`);
  };

  const slotAt = (ymd: string, time: string) =>
    slots.find((s) => s.date === ymd && s.start === time);

  return (
    <div className={styles.container} dir="rtl">
      <motion.div
        className={styles.introCard}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.introHeader}>
          <CalendarCheck />
          <h2>دریافت نوبت</h2>
        </div>
        <p className={styles.introText}>
          درمانگر را انتخاب کنید و نوبت آزاد را رزرو کنید. پس از ثبت نام و شماره
          تماس، به گفتگوی پیش‌مشاوره هدایت می‌شوید.
        </p>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <i className={`${styles.dot} ${styles.dotFree}`} />
            آزاد — قابل رزرو
          </span>
          <span className={styles.legendItem}>
            <i className={`${styles.dot} ${styles.dotBooked}`} />
            <Ban size={12} />
            اشغال / غیرفعال
          </span>
        </div>
      </motion.div>

      <section className={styles.doctorsSection}>
        <h3 className={styles.sectionTitle}>انتخاب درمانگر</h3>
        <div className={styles.doctorGrid}>
          {doctorsList.map((doc) => {
            const active = doc.id === selectedDoctorId;
            return (
              <button
                key={doc.id}
                type="button"
                className={`${styles.doctorCard} ${active ? styles.doctorCardActive : ""}`}
                onClick={() => setSelectedDoctorId(doc.id)}
              >
                <span
                  className={styles.doctorAvatar}
                  style={{ backgroundColor: doc.imageColor }}
                >
                  <Stethoscope />
                </span>
                <span className={styles.doctorMeta}>
                  <strong>{doc.nameFa}</strong>
                  <span>{doc.specialtyFa}</span>
                  <em>{doc.yearsExperience} سال سابقه</em>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {selectedDoctor ? (
        <section className={styles.calendarSection}>
          <div className={styles.calendarToolbar}>
            <div className={styles.calendarTitleBlock}>
              <h3 className={styles.sectionTitle}>
                تقویم نوبت — {selectedDoctor.nameFa}
              </h3>
              <p className={styles.weekLabel}>{weekLabel}</p>
            </div>
            <div className={styles.weekNav}>
              <button
                type="button"
                className={styles.weekBtn}
                onClick={() =>
                  setWeekAnchor((d) => {
                    const n = new Date(d);
                    n.setDate(n.getDate() - 7);
                    return n;
                  })
                }
                aria-label="هفته قبل"
              >
                <ChevronRight />
              </button>
              <button
                type="button"
                className={styles.weekBtnToday}
                onClick={() => setWeekAnchor(new Date())}
              >
                این هفته
              </button>
              <button
                type="button"
                className={styles.weekBtn}
                onClick={() =>
                  setWeekAnchor((d) => {
                    const n = new Date(d);
                    n.setDate(n.getDate() + 7);
                    return n;
                  })
                }
                aria-label="هفته بعد"
              >
                <ChevronLeft />
              </button>
            </div>
          </div>

          <div className={styles.statsRow}>
            <span>
              <Clock />
              {counts.available} نوبت آزاد
            </span>
            <span>
              <CheckCircle2 />
              {counts.booked} نوبت رزرو شده
            </span>
          </div>

          <div className={styles.calendarScroll}>
            <div className={styles.calendarGrid}>
              <div className={styles.cornerCell}>ساعت</div>
              {weekColumns.map((col) => (
                <div key={col.ymd} className={styles.dayHead}>
                  <strong>{col.dayName}</strong>
                  <span>{col.dateLabel}</span>
                </div>
              ))}

              {BOOKING_TIMES.map((time) => (
                <div key={time} className={styles.timeRow}>
                  <div className={styles.timeCell}>{time}</div>
                  {weekColumns.map((col) => {
                    const slot = slotAt(col.ymd, time);
                    if (!slot) {
                      return (
                        <div
                          key={`${col.ymd}-${time}`}
                          className={styles.occupiedCell}
                          aria-hidden
                        >
                          <Ban className={styles.occupiedIcon} />
                        </div>
                      );
                    }
                    if (slot.status === "available") {
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          className={styles.freeCell}
                          onClick={() => openReserveDialog(slot)}
                          aria-label={`رزرو نوبت ${time}`}
                        >
                          <CircleDot className={styles.freeIcon} />
                          <span>آزاد</span>
                        </button>
                      );
                    }
                    return (
                      <div
                        key={slot.id}
                        className={styles.occupiedCell}
                        aria-label={
                          slot.status === "booked" ? "اشغال" : "غیرفعال"
                        }
                      >
                        <Ban className={styles.occupiedIcon} />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Dialog
        open={!!pendingSlot}
        onOpenChange={(open) => {
          if (!open) setPendingSlot(null);
        }}
      >
        <DialogContent className={styles.dialog} dir="rtl">
          <DialogHeader>
            <DialogTitle>ثبت رزرو نوبت</DialogTitle>
            <DialogDescription>
              {selectedDoctor?.nameFa}
              {pendingSlot
                ? ` — ${new Date(pendingSlot.date + "T12:00:00").toLocaleDateString("fa-IR", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })} ساعت ${pendingSlot.start}`
                : ""}
            </DialogDescription>
          </DialogHeader>

          <div className={styles.form}>
            <label className={styles.field}>
              <span>
                <User size={14} />
                نام و نام خانوادگی
              </span>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="نام کامل شما"
              />
            </label>
            <label className={styles.field}>
              <span>
                <Phone size={14} />
                شماره تماس
              </span>
              <input
                type="tel"
                dir="ltr"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="0912xxxxxxx"
              />
            </label>
            <button
              type="button"
              className={styles.confirmBtn}
              disabled={submitting}
              onClick={confirmBooking}
            >
              {submitting ? "در حال ثبت..." : "ثبت نوبت و ادامه به پیش‌مشاوره"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
