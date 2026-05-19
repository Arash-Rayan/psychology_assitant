'use client';

import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Activity, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import {
  ANALYSIS_AGENTS,
  DEFAULT_ANALYSIS_AGENT,
  defaultOutputsForAgent,
  getAnalysisAgent,
  type AnalysisAgentId,
} from '@/constants/analysisAgents';
import {
  buildAgentTimeline,
  computeIntensityTrend,
  trendLabel,
  type IntensityTrend,
} from '@/utils/patientAgentTimeline';
import styles from './PatientAgentIntensityPanel.module.css';

const LINE_COLORS = ['#8B5CF6', '#2563EB', '#059669', '#D97706', '#DC2626', '#0891B2'];

interface PatientAgentIntensityPanelProps {
  patientId: string;
  sessionCount: number;
}

function TrendIcon({ trend }: { trend: IntensityTrend }) {
  if (trend === 'up') return <TrendingUp className={styles.trendUp} />;
  if (trend === 'down') return <TrendingDown className={styles.trendDown} />;
  return <Minus className={styles.trendStable} />;
}

export function PatientAgentIntensityPanel({
  patientId,
  sessionCount,
}: PatientAgentIntensityPanelProps) {
  const [agentId, setAgentId] = useState<AnalysisAgentId>(DEFAULT_ANALYSIS_AGENT);
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>(() =>
    defaultOutputsForAgent(DEFAULT_ANALYSIS_AGENT),
  );

  const agent = getAnalysisAgent(agentId);

  const handleAgentChange = (id: AnalysisAgentId) => {
    setAgentId(id);
    setSelectedOutputs(defaultOutputsForAgent(id));
  };

  const toggleOutput = (key: string) => {
    setSelectedOutputs((prev) => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev;
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  };

  const timeline = useMemo(
    () => buildAgentTimeline(patientId, sessionCount, agentId, selectedOutputs),
    [patientId, sessionCount, agentId, selectedOutputs],
  );

  const chartData = useMemo(
    () =>
      timeline.map((point) => {
        const row: Record<string, string | number> = { label: point.label };
        for (const key of selectedOutputs) {
          const opt = agent.outputs.find((o) => o.key === key);
          row[opt?.label ?? key] = point.values[key] ?? 0;
        }
        return row;
      }),
    [timeline, selectedOutputs, agent.outputs],
  );

  const primaryTrend = useMemo(() => {
    if (selectedOutputs.length === 0) return 'stable' as IntensityTrend;
    return computeIntensityTrend(timeline, selectedOutputs[0], agent.scaleMax);
  }, [timeline, selectedOutputs, agent.scaleMax]);

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <Activity className={styles.panelIcon} aria-hidden />
        <h3 className={styles.panelTitle}>روند شدت — تحلیل‌گرهای مکالمه</h3>
      </div>

      <p className={styles.fieldLabel}>انتخاب تحلیل‌گر</p>
      <div className={styles.agentGrid} role="tablist" aria-label="تحلیل‌گرها">
        {ANALYSIS_AGENTS.map((a) => {
          const active = agentId === a.id;
          return (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={cn(styles.agentTab, active && styles.agentTabActive)}
              onClick={() => handleAgentChange(a.id)}
            >
              {a.label}
            </button>
          );
        })}
      </div>

      <p className={styles.outputsLabel}>
        خروجی‌های {agent.label} (برای نمودار انتخاب کنید)
      </p>
      <div className={styles.outputChips}>
        {agent.outputs.map((opt) => {
          const active = selectedOutputs.includes(opt.key);
          return (
            <button
              key={opt.key}
              type="button"
              className={active ? styles.chipActive : styles.chip}
              onClick={() => toggleOutput(opt.key)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className={styles.trendRow}>
        <TrendIcon trend={primaryTrend} />
        <span>
          تغییر شدت (جلسه اول ↔ آخر): <strong>{trendLabel(primaryTrend)}</strong>
        </span>
        <span className={styles.scaleHint}>مقیاس ۰–{agent.scaleMax}</span>
      </div>

      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, agent.scaleMax]} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                direction: 'rtl',
                fontFamily: 'inherit',
              }}
            />
            <Legend wrapperStyle={{ direction: 'rtl', fontSize: 12 }} />
            {selectedOutputs.map((key, i) => {
              const opt = agent.outputs.find((o) => o.key === key);
              const dataKey = opt?.label ?? key;
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={dataKey}
                  stroke={LINE_COLORS[i % LINE_COLORS.length]}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
