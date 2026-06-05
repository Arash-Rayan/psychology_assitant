'use client';

import { useEffect, useMemo, useState } from 'react';
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
  getAnalysisAgent,
  type AnalysisAgentId,
} from '@/constants/analysisAgents';
import { AgentAnalysisTab } from '@/components/AgentAnalysisTab';
import {
  getAgentOutputCount,
  getAnalysisItemsForAgent,
  getDisplaySummary,
  getTopAnalysisItem,
  type AnalysisResultItem,
} from '@/constants/analysisDemoData';
import {
  buildAgentTimeline,
  buildEmotionalStateLine,
  computeIntensityTrend,
  trendLabel,
  type IntensityTrend,
} from '@/utils/patientAgentTimeline';
import styles from './PatientAgentIntensityPanel.module.css';

interface PatientAgentIntensityPanelProps {
  patientId: string;
  sessionCount: number;
}

function TrendIcon({ trend }: { trend: IntensityTrend }) {
  if (trend === 'up') return <TrendingUp className={styles.trendUp} />;
  if (trend === 'down') return <TrendingDown className={styles.trendDown} />;
  return <Minus className={styles.trendStable} />;
}

function mergePatientMoodScore(
  items: AnalysisResultItem[],
  patientId: string,
  sessionCount: number,
): AnalysisResultItem[] {
  const line = buildEmotionalStateLine(patientId, sessionCount);
  return items.map((item) =>
    item.key === 'mood' ? { ...item, score: line.intensity } : item,
  );
}

export function PatientAgentIntensityPanel({
  patientId,
  sessionCount,
}: PatientAgentIntensityPanelProps) {
  const [agentId, setAgentId] = useState<AnalysisAgentId>(DEFAULT_ANALYSIS_AGENT);
  const [chartKey, setChartKey] = useState<string>('mood');

  const agent = getAnalysisAgent(agentId);
  const isEmotional = agentId === 'emotional_state';
  const isSchema = agentId === 'schema';

  const analysisItems = useMemo(() => {
    const items = getAnalysisItemsForAgent(agentId, patientId);
    if (isEmotional) {
      return mergePatientMoodScore(items, patientId, sessionCount);
    }
    return items;
  }, [agentId, isEmotional, patientId, sessionCount]);

  const scoreMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of analysisItems) {
      map[item.key] = item.score;
    }
    return map;
  }, [analysisItems]);

  useEffect(() => {
    if (isEmotional) {
      setChartKey('mood');
      return;
    }
    const top = getTopAnalysisItem(agentId, patientId);
    if (top) setChartKey(top.key);
    else if (analysisItems[0]) setChartKey(analysisItems[0].key);
  }, [agentId, isEmotional, analysisItems]);

  const selectedItem = useMemo(
    () => analysisItems.find((i) => i.key === chartKey) ?? analysisItems[0],
    [analysisItems, chartKey],
  );

  const topItem = analysisItems[0];
  const hasSubOptions = !isEmotional && analysisItems.length > 1;

  const timeline = useMemo(() => {
    if (!selectedItem) return [];
    return buildAgentTimeline(
      patientId,
      sessionCount,
      agentId,
      [chartKey],
      scoreMap,
    );
  }, [patientId, sessionCount, agentId, chartKey, scoreMap, selectedItem]);

  const chartData = useMemo(() => {
    if (!selectedItem) return [];
    return timeline.map((point) => ({
      label: point.label,
      [selectedItem.label]: point.values[chartKey] ?? 0,
    }));
  }, [timeline, selectedItem, chartKey]);

  const trend = useMemo(
    () => computeIntensityTrend(timeline, chartKey, agent.scaleMax),
    [timeline, chartKey, agent.scaleMax],
  );

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <Activity className={styles.panelIcon} aria-hidden />
        <h3 className={styles.panelTitle}>روند شدت — تحلیل‌گرهای مکالمه</h3>
      </div>

      <p className={styles.fieldLabel}>انتخاب تحلیل‌گر</p>
      <div className={styles.agentGrid} role="tablist" aria-label="تحلیل‌گرها">
        {ANALYSIS_AGENTS.map((a) => (
          <AgentAnalysisTab
            key={a.id}
            label={a.label}
            count={getAgentOutputCount(a.id, patientId)}
            active={agentId === a.id}
            onClick={() => setAgentId(a.id)}
            className={styles.agentTabCard}
          />
        ))}
      </div>

      {!selectedItem && (
        <p className={styles.emptyState}>
          تحلیل این بخش هنوز برای این مراجع ثبت نشده است.
        </p>
      )}

      {selectedItem && (
        <>
          {topItem && hasSubOptions && (
            <p className={styles.chartHint}>
              نمودار پیش‌فرض: «{topItem.label}» (بالاترین نمره: {topItem.score}/
              {agent.scaleMax})
            </p>
          )}

          <div className={styles.trendRow}>
            <TrendIcon trend={trend} />
            <span>
              {isEmotional ? (
                <>
                  <strong>خلق</strong> — {trendLabel(trend)}
                </>
              ) : (
                <>
                  در حال نمایش: <strong>{selectedItem.label}</strong> —{' '}
                  {trendLabel(trend)}
                </>
              )}
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
                <Line
                  type="monotone"
                  dataKey={selectedItem.label}
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {hasSubOptions && (
            <div className={styles.selectorBlock}>
              <p className={styles.selectorLabel}>
                انتخاب مورد از «{agent.label}» برای نمایش روی نمودار
              </p>
              <div className={styles.outputChips}>
                {analysisItems.map((item, index) => {
                  const active = chartKey === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      className={cn(styles.chip, active && styles.chipActive)}
                      onClick={() => setChartKey(item.key)}
                    >
                      <span className={styles.chipLabel}>{item.label}</span>
                      <span className={styles.chipScore}>
                        {item.score}/{agent.scaleMax}
                      </span>
                      {index === 0 && (
                        <span className={styles.chipTopBadge}>بالاترین</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.detailPanel}>
            <div className={styles.detailHeader}>
              <h4 className={styles.detailTitle}>
                {isEmotional ? 'خلاصهٔ حالت هیجانی' : `خلاصه: ${selectedItem.label}`}
              </h4>
              {!isEmotional && (
                <span className={styles.detailScore}>
                  نمره {selectedItem.score}/{agent.scaleMax}
                </span>
              )}
            </div>

            <p className={styles.detailSummary}>{getDisplaySummary(selectedItem)}</p>

            {selectedItem.evidence && selectedItem.evidence.length > 0 && (
              <div className={styles.detailBlock}>
                <p className={styles.detailBlockTitle}>
                  {isEmotional
                    ? 'نمونه‌هایی از گفتگو که این احساس‌ها را نشان می‌دهند'
                    : 'شواهد از مکالمه'}
                </p>
                <ul className={styles.evidenceList}>
                  {selectedItem.evidence.map((ev, idx) => (
                    <li key={`${selectedItem.key}-ev-${idx}`}>{ev}</li>
                  ))}
                </ul>
              </div>
            )}

            {isSchema && selectedItem.coreBelief && (
              <div className={styles.detailBlock}>
                <p className={styles.detailBlockTitle}>باور بنیادین</p>
                <p className={styles.detailBlockText}>{selectedItem.coreBelief}</p>
              </div>
            )}

            {hasSubOptions && (
              <div className={styles.otherItemsBlock}>
                <p className={styles.otherItemsTitle}>
                  سایر موارد شناسایی‌شده در این تحلیل‌گر
                </p>
                <ul className={styles.otherItemsList}>
                  {analysisItems
                    .filter((item) => item.key !== chartKey)
                    .map((item) => (
                      <li key={item.key}>
                        <button
                          type="button"
                          className={styles.otherItemBtn}
                          onClick={() => setChartKey(item.key)}
                        >
                          <span className={styles.otherItemLabel}>{item.label}</span>
                          <span className={styles.otherItemMeta}>
                            {item.score}/{agent.scaleMax} —{' '}
                            {getDisplaySummary(item).slice(0, 72)}
                            {getDisplaySummary(item).length > 72 ? '…' : ''}
                          </span>
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
