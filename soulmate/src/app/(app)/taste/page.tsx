import { MOCK_BOOKS, MOCK_RECOMMENDATIONS } from "@/lib/constants";
import styles from "./taste.module.css";

export default function TastePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>کتاب و سلیقه</h1>
        <p>موسیقی، فلسفه، موضوعات — AI بر اساس این‌ها پیشنهاد می‌دهد</p>
      </header>

      <section className="glass" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
        <h2>پیشنهاد AI</h2>
        <div className={styles.suggestGrid}>
          {MOCK_RECOMMENDATIONS.filter((r) => r.kind === "book").map((r) => (
            <div key={r.id} className={styles.suggest}>
              <strong>{r.title}</strong>
              <p>{r.reason}</p>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.bookGrid}>
        {MOCK_BOOKS.map((b) => (
          <div key={b.id} className="glass" style={{ padding: "1rem" }}>
            <span className={styles.status}>{b.status === "reading" ? "در حال خواندن" : b.status === "want" ? "می‌خواهم" : "تمام"}</span>
            <h3>{b.title}</h3>
            <p>{b.author} · {b.genre}</p>
            {b.progress && (
              <div className={styles.bar}><div style={{ width: `${b.progress}%` }} /></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
