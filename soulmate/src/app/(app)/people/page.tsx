import { MOCK_PEOPLE } from "@/lib/constants";
import styles from "./people.module.css";

export default function PeoplePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>هم‌مسیرها</h1>
        <p>بر اساس هدف، عادت، کتاب — نه اپ قرار</p>
      </header>
      <div className={styles.grid}>
        {MOCK_PEOPLE.map((p) => (
          <div key={p.id} className="glass" style={{ padding: "1.25rem" }}>
            <div className={styles.head}>
              <div className={styles.avatar}>{p.avatarInitial}</div>
              <div>
                <strong>{p.name}</strong>
                <p>{p.purpose}</p>
              </div>
              <span className={styles.score}>{p.overlapScore}٪</span>
            </div>
            <ul>
              {p.overlapReasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <button type="button" className={styles.btn}>دعوت هم‌درس</button>
          </div>
        ))}
      </div>
    </div>
  );
}
