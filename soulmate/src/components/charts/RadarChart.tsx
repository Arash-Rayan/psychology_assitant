import type { RadarDimension } from "@/lib/types";
import styles from "./RadarChart.module.css";

type Props = { data: RadarDimension[]; size?: number };

export function RadarChart({ data, size = 200 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const n = data.length;
  const angleStep = (2 * Math.PI) / n;

  const point = (i: number, val: number) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const r = (val / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const dataPoints = data.map((d, i) => point(i, d.value));
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const gridLevels = [25, 50, 75, 100];

  return (
    <div className={styles.wrap}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {gridLevels.map((level) => {
          const pts = data.map((_, i) => point(i, level));
          return (
            <polygon
              key={level}
              points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        })}
        {data.map((_, i) => {
          const p = point(i, 100);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.06)"
            />
          );
        })}
        <polygon
          points={polygon}
          fill="rgba(139, 92, 246, 0.25)"
          stroke="#8b5cf6"
          strokeWidth="2"
        />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#22d3ee" />
        ))}
      </svg>
      <div className={styles.labels}>
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
