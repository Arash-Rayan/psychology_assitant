"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { MOCK_ANALYTICS } from "@/lib/constants";
import type { Timeframe } from "@/lib/types";
import { ProductivityRing } from "@/components/charts/ProductivityRing";
import { BarChart } from "@/components/charts/BarChart";
import styles from "./analytics.module.css";

const PERIODS: { id: Timeframe; label: string }[] = [
  { id: "week", label: "هفته" },
  { id: "month", label: "ماه" },
  { id: "year", label: "سال" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const data = MOCK_ANALYTICS[period];

  const TrendIcon =
    data.trend === "up" ? TrendingUp : data.trend === "down" ? TrendingDown : Minus;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>تحلیل پیشرفت</h1>
          <p>هفته، ماه، سال — روند بهبود یا افت</p>
        </div>
        <div className={styles.tabs}>
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={period === p.id ? styles.tabOn : styles.tab}
              onClick={() => setPeriod(p.id as "week" | "month" | "year")}
            >
              {p.label}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.grid}>
        <div className={`${styles.card} glass`}>
          <h2>{data.label}</h2>
          <div className={styles.ringRow}>
            <ProductivityRing value={data.productivity} size={120} />
            <div className={styles.trend} data-trend={data.trend}>
              <TrendIcon size={20} />
              <span>
                {data.trend === "up" ? "+" : data.trend === "down" ? "-" : ""}
                {data.trendPercent}٪ نسبت به قبل
              </span>
            </div>
          </div>
          <div className={styles.metrics}>
            <div><strong>{data.tasksDone}/{data.tasksTotal}</strong><span>کارها</span></div>
            <div><strong>{data.focusHours}h</strong><span>تمرکز</span></div>
          </div>
        </div>

        <div className={`${styles.card} glass`}>
          <h2>نمودار {data.label}</h2>
          <BarChart
            data={data.chartData.slice(0, period === "week" ? 7 : period === "month" ? 30 : 12)}
            height={120}
          />
          {data.trend === "down" && (
            <p className={styles.warning}>
              ⚠ این ماه ۵٪ افت داشتی — علت احتمالی: خواب کم و overcommitment (ببین insights)
            </p>
          )}
          {data.trend === "up" && (
            <p className={styles.good}>✓ روند مثبت — ثبات صبحگاهی تأثیر داشته</p>
          )}
        </div>

        <div className={`${styles.card} glass ${styles.wide}`}>
          <h2>مقایسه دوره‌ها</h2>
          <div className={styles.compare}>
            {(["week", "month", "year"] as const).map((p) => (
              <div key={p} className={styles.compareItem}>
                <span>{MOCK_ANALYTICS[p].label}</span>
                <strong>{MOCK_ANALYTICS[p].productivity}٪</strong>
                <div className={styles.miniBar}>
                  <div style={{ width: `${MOCK_ANALYTICS[p].productivity}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
