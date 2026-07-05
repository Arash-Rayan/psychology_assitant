import { MOCK_INSIGHTS, MOCK_RECOMMENDATIONS, MOCK_RADAR } from "@/lib/constants";
import { RadarChart } from "@/components/charts/RadarChart";
import styles from "./insights.module.css";

export default function InsightsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>بینش AI</h1>
        <p>قوت‌ها، ضعف‌ها، کتاب، podcast، و یادداشت‌های رشد</p>
      </header>

      <div className={styles.grid}>
        <section className="glass" style={{ padding: "1.25rem" }}>
          <h2>نقاط قوت</h2>
          {MOCK_INSIGHTS.filter((i) => i.type === "strength").map((i) => (
            <p key={i.id} className={styles.strength}>✓ {i.text}</p>
          ))}
          <h2 style={{ marginTop: "1rem" }}>نیاز به بهبود</h2>
          {MOCK_INSIGHTS.filter((i) => i.type === "weakness").map((i) => (
            <p key={i.id} className={styles.weakness}>⚠ {i.text}</p>
          ))}
          <h2 style={{ marginTop: "1rem" }}>پیشنهاد عملی</h2>
          {MOCK_INSIGHTS.filter((i) => i.type === "suggestion").map((i) => (
            <p key={i.id} className={styles.suggestion}>→ {i.text}</p>
          ))}
        </section>

        <section className="glass" style={{ padding: "1.25rem" }}>
          <h2>تعادل — radar</h2>
          <RadarChart data={MOCK_RADAR} size={220} />
          <p className={styles.radarNote}>آرامش ۶۵٪ — journal یا podcast اضطراب می‌تواند کمک کند</p>
        </section>

        <section className={`glass ${styles.recs}`} style={{ padding: "1.25rem" }}>
          <h2>کتاب · podcast · یادداشت</h2>
          {MOCK_RECOMMENDATIONS.map((r) => (
            <div key={r.id} className={styles.rec}>
              <span className={styles.kind}>{r.kind === "book" ? "📖" : r.kind === "podcast" ? "🎧" : "📝"}</span>
              <div>
                <strong>{r.title}</strong>
                <p>{r.subtitle}</p>
                <p className={styles.reason}>{r.reason}</p>
                <button type="button">افزودن به planner / library</button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
