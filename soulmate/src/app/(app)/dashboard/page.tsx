"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Zap, Check } from "lucide-react";
import {
  MOCK_HOURLY_TASKS,
  MOCK_DAY_PROGRESS,
  MOCK_WEEK_STRIP,
  MOCK_RADAR,
  MOCK_INSIGHTS,
  MOCK_RECOMMENDATIONS,
  MOCK_GOALS,
} from "@/lib/constants";
import type { HourlyTask, Timeframe } from "@/lib/types";
import { ProductivityRing } from "@/components/charts/ProductivityRing";
import { RadarChart } from "@/components/charts/RadarChart";
import { BarChart } from "@/components/charts/BarChart";
import styles from "./dashboard.module.css";

const TIMEFRAMES: { id: Timeframe; label: string }[] = [
  { id: "day", label: "روز" },
  { id: "week", label: "هفته" },
  { id: "month", label: "ماه" },
  { id: "year", label: "سال" },
];

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("day");
  const [tasks, setTasks] = useState<HourlyTask[]>(MOCK_HOURLY_TASKS);
  const progress = MOCK_DAY_PROGRESS;
  const doneNow = tasks.filter((t) => t.done).length;
  const taskPct = Math.round((doneNow / tasks.length) * 100);
  const showAlert = doneNow < tasks.length;

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) return { ...t, done: !t.done };
        return t;
      })
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>صبح بخیر، رایان</h1>
          <p className={styles.date}>پنج‌شنبه، ۸ خرداد ۱۴۰۴</p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.focusBtn}>
            <Zap size={14} /> حالت تمرکز
          </button>
          <div className={styles.timeframes}>
            {TIMEFRAMES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={timeframe === t.id ? styles.tfActive : styles.tf}
                onClick={() => setTimeframe(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className={styles.weekStrip}>
        {MOCK_WEEK_STRIP.map((d) => (
          <button
            key={d.date}
            type="button"
            className={`${styles.dayPill} ${d.isToday ? styles.dayToday : ""}`}
          >
            <span>{d.label}</span>
            <strong>{d.date}</strong>
          </button>
        ))}
      </div>

      {showAlert && (
        <div className={`${styles.dayAlert} glass`}>
          <ProductivityRing value={taskPct} size={72} label="" />
          <div>
            <strong>
              امروز: {doneNow} از {tasks.length} کار انجام شد
            </strong>
            <p>
              {tasks.length - doneNow} کار باقی مانده · {progress.focusMinutes} دقیقه تمرکز
            </p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${taskPct}%` }} />
            </div>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        <section className={`${styles.card} glass`}>
          <div className={styles.cardHead}>
            <h2>برنامه امروز</h2>
            <Link href="/planner">تقویم کامل</Link>
          </div>
          <ul className={styles.taskList}>
            {tasks.map((t) => (
              <li key={t.id} className={t.done ? styles.taskDone : ""}>
                <button type="button" className={styles.check} onClick={() => toggleTask(t.id)}>
                  {t.done ? <Check size={12} /> : null}
                </button>
                <span className={styles.time}>{t.time}</span>
                <span className={styles.taskTitle}>{t.title}</span>
                <span
                  className={styles.tag}
                  style={{
                    background: `${t.tagColor}22`,
                    color: t.tagColor,
                    borderColor: `${t.tagColor}44`,
                  }}
                >
                  {t.tag}
                </span>
              </li>
            ))}
          </ul>
          <button type="button" className={styles.addTask}>
            <Plus size={16} /> افزودن کار
          </button>
        </section>

        <section className={`${styles.card} glass`}>
          <h2>نمای کلی بهره‌وری</h2>
          <div className={styles.ringRow}>
            <ProductivityRing value={progress.productivity} />
            <div className={styles.stats}>
              <div>
                <strong>
                  {progress.completed}/{progress.total}
                </strong>
                <span>کار انجام‌شده</span>
              </div>
              <div>
                <strong>
                  {Math.floor(progress.focusMinutes / 60)}h {progress.focusMinutes % 60}m
                </strong>
                <span>زمان تمرکز</span>
              </div>
            </div>
          </div>
          <BarChart
            data={MOCK_WEEK_STRIP.filter((d) => d.productivity).map((d) => d.productivity ?? 0)}
            labels={["ش", "ی", "د", "س", "چ", "پ", "ج"]}
            height={64}
          />
        </section>

        <section className={`${styles.card} glass`}>
          <h2>بینش AI</h2>
          <div className={styles.insights}>
            <div>
              <h3>نقاط قوت</h3>
              {MOCK_INSIGHTS.filter((i) => i.type === "strength").map((i) => (
                <p key={i.id} className={styles.strength}>
                  {i.text}
                </p>
              ))}
            </div>
            <div>
              <h3>نیاز به بهبود</h3>
              {MOCK_INSIGHTS.filter((i) => i.type === "weakness").map((i) => (
                <p key={i.id} className={styles.weakness}>
                  {i.text}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.card} glass`}>
          <h2>پیشنهاد AI</h2>
          {MOCK_RECOMMENDATIONS.map((r) => (
            <div key={r.id} className={styles.rec}>
              <span className={styles.recTag}>{r.tag}</span>
              <strong>{r.title}</strong>
              <p className={styles.recSub}>{r.subtitle}</p>
              <p className={styles.recReason}>{r.reason}</p>
            </div>
          ))}
        </section>

        <section className={`${styles.card} glass`}>
          <h2>پیشرفت اهداف</h2>
          {MOCK_GOALS.map((g) => (
            <div key={g.id} className={styles.goal}>
              <div className={styles.goalHead}>
                <span>{g.title}</span>
                <span>
                  {g.current}/{g.target} {g.unit}
                </span>
              </div>
              <div className={styles.goalBar}>
                <div style={{ width: `${(g.current / g.target) * 100}%` }} />
              </div>
              <small>موعد: {g.deadline}</small>
            </div>
          ))}
        </section>

        <section className={`${styles.card} glass`}>
          <h2>تعادل زندگی</h2>
          <RadarChart data={MOCK_RADAR} />
        </section>

        <section className={`${styles.card} glass ${styles.aiFocus}`}>
          <h2>تمرکز AI امروز</h2>
          <p>
            پیک بهره‌وری تو ۸ تا ۱۰:۳۰ است. برای اضطراب امتحان journal ساعت ۱۹ یا podcast پیشنهادی.
          </p>
          <Link href="/journal" className={styles.chatLink}>
            گفتگو با AI
          </Link>
        </section>
      </div>
    </div>
  );
}
