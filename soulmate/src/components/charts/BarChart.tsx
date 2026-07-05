import styles from "./BarChart.module.css";

type Props = {
  data: number[];
  labels?: string[];
  height?: number;
};

export function BarChart({ data, labels, height = 80 }: Props) {
  const max = Math.max(...data, 1);

  return (
    <div className={styles.wrap} style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className={styles.col}>
          <div
            className={styles.bar}
            style={{ height: `${(v / max) * 100}%`, opacity: v === 0 ? 0.2 : 1 }}
          />
          {labels && <span>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}
