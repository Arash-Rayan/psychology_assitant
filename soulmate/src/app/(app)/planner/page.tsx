"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { MOCK_HOURLY_TASKS, HOUR_SLOTS } from "@/lib/constants";
import type { HourlyTask, Timeframe } from "@/lib/types";
import styles from "./planner.module.css";

const VIEWS: { id: Timeframe; label: string }[] = [
  { id: "day", label: "روز" },
  { id: "week", label: "هفته" },
  { id: "month", label: "ماه" },
  { id: "year", label: "سال" },
];

export default function PlannerPage() {
  const [view, setView] = useState<Timeframe>("day");
  const [tasks, setTasks] = useState<HourlyTask[]>(MOCK_HOURLY_TASKS);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("۱۴:۰۰");

  function toggle(id: string) {
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function addTask() {
    if (!newTitle.trim()) return;
    setTasks((p) => [
      ...p,
      {
        id: `n-${Date.now()}`,
        time: newTime,
        title: newTitle.trim(),
        done: false,
        tag: "جدید",
        tagColor: "#8b5cf6",
        category: "focus",
      },
    ]);
    setNewTitle("");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>تقویم هوشمند</h1>
          <p>کار را به ساعت اختصاص بده — روز، هفته، ماه، سال</p>
        </div>
        <div className={styles.tabs}>
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={view === v.id ? styles.tabOn : styles.tab}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </header>

      {view === "day" && (
        <div className={styles.dayView}>
          <div className={`${styles.timeline} glass`}>
            {HOUR_SLOTS.map((hour) => {
              const hourTasks = tasks.filter((t) => t.time.slice(0, 2) === hour.slice(0, 2));
              return (
                <div key={hour} className={styles.hourRow}>
                  <span className={styles.hourLabel}>{hour}</span>
                  <div className={styles.hourSlot}>
                    {hourTasks.map((t) => (
                      <div
                        key={t.id}
                        className={`${styles.taskBlock} ${t.done ? styles.taskDone : ""}`}
                        style={{ borderColor: t.tagColor, background: `${t.tagColor}18` }}
                      >
                        <button type="button" className={styles.check} onClick={() => toggle(t.id)}>
                          {t.done && <Check size={10} />}
                        </button>
                        <div>
                          <strong>{t.title}</strong>
                          <span style={{ color: t.tagColor }}>{t.tag}</span>
                        </div>
                      </div>
                    ))}
                    {hourTasks.length === 0 && (
                      <button type="button" className={styles.emptySlot}>+</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <aside className={`${styles.sidebar} glass`}>
            <h3>افزودن سریع</h3>
            <select value={newTime} onChange={(e) => setNewTime(e.target.value)} className={styles.input}>
              {HOUR_SLOTS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <input
              className={styles.input}
              placeholder="عنوان کار..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <button type="button" className={styles.addBtn} onClick={addTask}>
              <Plus size={16} /> افزودن به {newTime}
            </button>
            <div className={styles.summary}>
              <p>امروز: {tasks.filter((t) => t.done).length}/{tasks.length}</p>
              <div className={styles.bar}>
                <div style={{ width: `${(tasks.filter((t) => t.done).length / tasks.length) * 100}%` }} />
              </div>
            </div>
          </aside>
        </div>
      )}

      {view === "week" && (
        <div className={`${styles.weekGrid} glass`}>
          {["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"].map((day, i) => (
            <div key={day} className={styles.weekCol}>
              <h3>{day}</h3>
              {i < 3 &&
                tasks.slice(i * 2, i * 2 + 2).map((t) => (
                  <div key={t.id} className={styles.miniTask} style={{ borderRightColor: t.tagColor }}>
                    {t.time} — {t.title}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}

      {view === "month" && (
        <div className={`${styles.monthView} glass`}>
          <h3>خرداد ۱۴۰۴</h3>
          <div className={styles.monthGrid}>
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} className={`${styles.monthCell} ${i + 1 === 29 ? styles.today : ""}`}>
                {i + 1}
                {(i + 1) % 3 !== 0 && <span className={styles.dot} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "year" && (
        <div className={styles.yearGrid}>
          {["Q1", "Q2", "Q3", "Q4"].map((q, i) => (
            <div key={q} className="glass" style={{ padding: "1.25rem" }}>
              <h3>{q} — ۱۴۰۴</h3>
              <div className={styles.bar} style={{ marginTop: "0.75rem" }}>
                <div style={{ width: `${[30, 45, 20, 10][i]}%` }} />
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                {[30, 45, 20, 10][i]}٪ از اهداف سال
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
