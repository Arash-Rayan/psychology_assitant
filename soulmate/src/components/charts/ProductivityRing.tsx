import styles from "./ProductivityRing.module.css";

type Props = {
  value: number;
  size?: number;
  label?: string;
  sublabel?: string;
};

export function ProductivityRing({ value, size = 140, label = "بهره‌وری", sublabel }: Props) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={styles.wrap} style={{ width: size, height: size }}>
      <svg width={size} height={size} className={styles.svg}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={styles.progress}
        />
      </svg>
      <div className={styles.center}>
        <strong>{value}٪</strong>
        <span>{label}</span>
        {sublabel && <small>{sublabel}</small>}
      </div>
    </div>
  );
}
