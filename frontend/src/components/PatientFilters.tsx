'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpDown,
  Brain,
  ChevronDown,
  Filter,
  Heart,
  Network,
  Search,
  X,
} from 'lucide-react';
import type { AnalysisAgentId } from '@/constants/analysisAgents';
import type { PatientDetail } from './PatientDetailView';
import { SCHEMA_TYPE_KEYS, SCHEMA_TYPES, type SchemaType } from './SchemaTypes';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Input } from './ui/input';
import {
  CHAT_TOPICS,
  DEFAULT_PATIENT_FILTERS,
  type ChatTopic,
  type PatientFilterState,
  type PatientSortOption,
  type PatientStatusFilter,
  type SchemaSeverityFilter,
  countPatientsWithSchema,
  hasActiveFilters,
  hasActivePatientPanelFilters,
} from '@/utils/filterPatients';
import {
  ANALYSIS_AGENTS,
  EMOTIONAL_STATE_BANDS,
  EMOTIONAL_TREND_OPTIONS,
  countPatientsWithAgent,
  type EmotionalStateBand,
} from '@/utils/patientAgentFilter';
import type { IntensityTrend } from '@/utils/patientAgentTimeline';
import styles from './PatientFilters.module.css';

interface PatientFiltersProps {
  patients: PatientDetail[];
  filters: PatientFilterState;
  onChange: (filters: PatientFilterState) => void;
  resultCount: number;
}

const STATUS_OPTIONS: Array<{
  value: PatientStatusFilter;
  label: string;
  className: string;
}> = [
  { value: 'all', label: 'همه', className: styles.statusAll },
  { value: 'safe', label: 'ایمن', className: styles.statusSafe },
  { value: 'attention', label: 'نیاز به توجه', className: styles.statusAttention },
  { value: 'urgent', label: 'فوری', className: styles.statusUrgent },
];

const SORT_OPTIONS: Array<{ value: PatientSortOption; label: string }> = [
  { value: 'score-desc', label: 'بیشترین امتیاز' },
  { value: 'score-asc', label: 'کمترین امتیاز' },
  { value: 'status-urgency', label: 'فوریت وضعیت' },
  { value: 'sessions-desc', label: 'بیشترین جلسات' },
  { value: 'name-asc', label: 'نام (الفبا)' },
];

const SEVERITY_OPTIONS: Array<{ value: SchemaSeverityFilter; label: string }> = [
  { value: 'all', label: 'همه شدت‌ها' },
  { value: 'high', label: 'شدید' },
  { value: 'medium', label: 'متوسط' },
  { value: 'low', label: 'خفیف' },
];

function panelFilterCount(filters: PatientFilterState): number {
  let count = 0;
  if (filters.status !== 'all') count += 1;
  count += filters.agents.length;
  count += filters.emotionalBands.length;
  count += filters.emotionalTrends.length;
  count += filters.schemas.length;
  count += filters.topics.length;
  if (filters.severity !== 'all') count += 1;
  return count;
}

export function PatientFilters({
  patients,
  filters,
  onChange,
  resultCount,
}: PatientFiltersProps) {
  const [schemaSearch, setSchemaSearch] = useState('');
  const [agentSearch, setAgentSearch] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);

  const update = (patch: Partial<PatientFilterState>) => {
    onChange({ ...filters, ...patch });
  };

  const toggleSchema = (schema: SchemaType) => {
    const next = filters.schemas.includes(schema)
      ? filters.schemas.filter((s) => s !== schema)
      : [...filters.schemas, schema];
    update({ schemas: next });
  };

  const toggleTopic = (topic: ChatTopic) => {
    const next = filters.topics.includes(topic)
      ? filters.topics.filter((t) => t !== topic)
      : [...filters.topics, topic];
    update({ topics: next });
  };

  const toggleAgent = (agentId: AnalysisAgentId) => {
    const next = filters.agents.includes(agentId)
      ? filters.agents.filter((a) => a !== agentId)
      : [...filters.agents, agentId];
    update({ agents: next });
  };

  const toggleEmotionalBand = (band: EmotionalStateBand) => {
    const next = filters.emotionalBands.includes(band)
      ? filters.emotionalBands.filter((b) => b !== band)
      : [...filters.emotionalBands, band];
    update({ emotionalBands: next });
  };

  const toggleEmotionalTrend = (trend: IntensityTrend) => {
    const next = filters.emotionalTrends.includes(trend)
      ? filters.emotionalTrends.filter((t) => t !== trend)
      : [...filters.emotionalTrends, trend];
    update({ emotionalTrends: next });
  };

  const filteredSchemaOptions = useMemo(() => {
    const q = schemaSearch.trim().toLowerCase();
    if (!q) return SCHEMA_TYPE_KEYS;
    return SCHEMA_TYPE_KEYS.filter((key) => {
      const meta = SCHEMA_TYPES[key];
      return (
        key.toLowerCase().includes(q) ||
        meta.english.toLowerCase().includes(q) ||
        meta.description.toLowerCase().includes(q)
      );
    });
  }, [schemaSearch]);

  const filteredAgentOptions = useMemo(() => {
    const q = agentSearch.trim().toLowerCase();
    if (!q) return ANALYSIS_AGENTS;
    return ANALYSIS_AGENTS.filter((agent) => agent.label.toLowerCase().includes(q));
  }, [agentSearch]);

  const active = hasActiveFilters(filters);
  const panelActive = hasActivePatientPanelFilters(filters);
  const panelCount = panelFilterCount(filters);

  const clearPanelFilters = () => {
    onChange({
      ...filters,
      status: 'all',
      agents: [],
      agentMatch: 'any',
      emotionalBands: [],
      emotionalTrends: [],
      schemas: [],
      schemaMatch: 'any',
      topics: [],
      severity: 'all',
    });
  };

  return (
    <div className={styles.wrapper} dir="rtl">
      <Collapsible open={panelOpen} onOpenChange={setPanelOpen}>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <Input
              value={filters.search}
              onChange={(e) => update({ search: e.target.value })}
              placeholder="جستجوی نام مراجع..."
              className={styles.searchInput}
              dir="rtl"
            />
            {filters.search && (
              <button
                type="button"
                className={styles.clearSearch}
                onClick={() => update({ search: '' })}
                aria-label="پاک کردن جستجو"
              >
                <X />
              </button>
            )}
          </div>

          <CollapsibleTrigger asChild>
            <button
              type="button"
              className={`${styles.filterPatientTrigger} ${
                panelActive ? styles.filterPatientTriggerActive : ''
              } ${panelOpen ? styles.filterPatientTriggerOpen : ''}`}
              aria-expanded={panelOpen}
            >
              <Filter />
              فیلتر مراجع
              {panelCount > 0 && (
                <Badge variant="secondary" className={styles.countBadge}>
                  {panelCount}
                </Badge>
              )}
              <ChevronDown className={styles.chevronIcon} />
            </button>
          </CollapsibleTrigger>

          <div className={styles.sortGroup}>
            <ArrowUpDown className={styles.rowIcon} />
            <select
              value={filters.sortBy}
              onChange={(e) => update({ sortBy: e.target.value as PatientSortOption })}
              className={styles.sortSelect}
              dir="rtl"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <CollapsibleContent className={styles.filterPatientPanel}>
            <div className={styles.panelHeader}>
              <span>فیلتر مراجع</span>
              {panelActive && (
                <button type="button" className={styles.popoverClear} onClick={clearPanelFilters}>
                  پاک کردن
                </button>
              )}
            </div>

            <section className={styles.filterSection}>
              <h3 className={styles.sectionTitle}>
                <Activity />
                وضعیت
              </h3>
              <div className={styles.chipRow}>
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`${styles.statusChip} ${option.className} ${
                      filters.status === option.value ? styles.statusChipActive : ''
                    }`}
                    onClick={() => update({ status: option.value })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.filterSection}>
              <h3 className={styles.sectionTitle}>
                <Heart />
                حالت هیجانی
              </h3>
              <p className={styles.sectionHint}>بر اساس تحلیل agent حالت هیجانی (خلق)</p>
              <div className={styles.chipRow}>
                {EMOTIONAL_STATE_BANDS.map((band) => (
                  <button
                    key={band.value}
                    type="button"
                    className={`${styles.topicChip} ${
                      filters.emotionalBands.includes(band.value) ? styles.topicChipActive : ''
                    }`}
                    onClick={() => toggleEmotionalBand(band.value)}
                  >
                    {band.label}
                    <span className={styles.chipHint}>{band.hint}</span>
                  </button>
                ))}
              </div>
              <div className={styles.chipRow}>
                {EMOTIONAL_TREND_OPTIONS.map((trend) => (
                  <button
                    key={trend.value}
                    type="button"
                    className={`${styles.topicChip} ${
                      filters.emotionalTrends.includes(trend.value) ? styles.topicChipActive : ''
                    }`}
                    onClick={() => toggleEmotionalTrend(trend.value)}
                  >
                    {trend.label}
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.filterSection}>
              <h3 className={styles.sectionTitle}>
                <Brain />
                تحلیل‌گرها
              </h3>
              <Input
                value={agentSearch}
                onChange={(e) => setAgentSearch(e.target.value)}
                placeholder="جستجو در تحلیل‌گرها..."
                className={styles.schemaSearch}
                dir="rtl"
              />
              <div className={styles.matchMode}>
                <span>تطابق:</span>
                <button
                  type="button"
                  className={`${styles.matchChip} ${
                    filters.agentMatch === 'any' ? styles.matchChipActive : ''
                  }`}
                  onClick={() => update({ agentMatch: 'any' })}
                >
                  هر کدام
                </button>
                <button
                  type="button"
                  className={`${styles.matchChip} ${
                    filters.agentMatch === 'all' ? styles.matchChipActive : ''
                  }`}
                  onClick={() => update({ agentMatch: 'all' })}
                >
                  همه
                </button>
              </div>
              <div className={styles.agentList}>
                {filteredAgentOptions.map((agent) => {
                  const count = countPatientsWithAgent(patients, agent.id);
                  const checked = filters.agents.includes(agent.id);
                  return (
                    <label key={agent.id} className={styles.agentItem}>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleAgent(agent.id)}
                      />
                      <span className={styles.agentLabel}>
                        <span className={styles.agentName}>{agent.label}</span>
                        <span className={styles.agentMeta}>
                          {agent.outputs.length} خروجی — مقیاس ۰–{agent.scaleMax}
                        </span>
                      </span>
                      <span className={styles.schemaCount}>{count}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className={styles.filterSection}>
              <h3 className={styles.sectionTitle}>
                <Network />
                طرحواره و موضوع
              </h3>
              <Input
                value={schemaSearch}
                onChange={(e) => setSchemaSearch(e.target.value)}
                placeholder="جستجو در طرحواره‌ها..."
                className={styles.schemaSearch}
                dir="rtl"
              />
              <div className={styles.topicGrid}>
                {CHAT_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className={`${styles.topicChip} ${
                      filters.topics.includes(topic) ? styles.topicChipActive : ''
                    }`}
                    onClick={() => toggleTopic(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
              <div className={styles.schemaList}>
                {filteredSchemaOptions.slice(0, 6).map((schema) => {
                  const count = countPatientsWithSchema(patients, schema, filters);
                  const checked = filters.schemas.includes(schema);
                  return (
                    <label key={schema} className={styles.schemaItem}>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleSchema(schema)}
                      />
                      <span className={styles.schemaName}>{schema}</span>
                      <span className={styles.schemaCount}>{count}</span>
                    </label>
                  );
                })}
              </div>
              <div className={styles.chipRow}>
                {SEVERITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`${styles.severityChip} ${
                      filters.severity === option.value ? styles.severityChipActive : ''
                    }`}
                    onClick={() => update({ severity: option.value })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>
        </CollapsibleContent>
      </Collapsible>

      <div className={styles.summaryRow}>
        <div className={styles.resultMeta}>
          <Filter className={styles.summaryIcon} />
          <span>{resultCount} مراجع</span>
        </div>

        {active && (
          <div className={styles.activeChips}>
            {filters.search && (
              <Badge variant="outline" className={styles.activeChip}>
                جستجو: {filters.search}
                <button type="button" onClick={() => update({ search: '' })}>
                  <X />
                </button>
              </Badge>
            )}
            {filters.status !== 'all' && (
              <Badge variant="outline" className={styles.activeChip}>
                {STATUS_OPTIONS.find((s) => s.value === filters.status)?.label}
                <button type="button" onClick={() => update({ status: 'all' })}>
                  <X />
                </button>
              </Badge>
            )}
            {filters.emotionalBands.map((band) => (
              <Badge key={band} variant="outline" className={styles.activeChip}>
                {EMOTIONAL_STATE_BANDS.find((b) => b.value === band)?.label}
                <button type="button" onClick={() => toggleEmotionalBand(band)}>
                  <X />
                </button>
              </Badge>
            ))}
            {filters.emotionalTrends.map((trend) => (
              <Badge key={trend} variant="outline" className={styles.activeChip}>
                {EMOTIONAL_TREND_OPTIONS.find((t) => t.value === trend)?.label}
                <button type="button" onClick={() => toggleEmotionalTrend(trend)}>
                  <X />
                </button>
              </Badge>
            ))}
            {filters.agents.map((agentId) => (
              <Badge key={agentId} variant="outline" className={styles.activeChip}>
                {ANALYSIS_AGENTS.find((a) => a.id === agentId)?.label}
                <button type="button" onClick={() => toggleAgent(agentId)}>
                  <X />
                </button>
              </Badge>
            ))}
            {filters.schemas.map((schema) => (
              <Badge key={schema} variant="outline" className={styles.activeChip}>
                {schema}
                <button type="button" onClick={() => toggleSchema(schema)}>
                  <X />
                </button>
              </Badge>
            ))}
            {filters.topics.map((topic) => (
              <Badge key={topic} variant="outline" className={styles.activeChip}>
                {topic}
                <button type="button" onClick={() => toggleTopic(topic)}>
                  <X />
                </button>
              </Badge>
            ))}
            {filters.severity !== 'all' && (
              <Badge variant="outline" className={styles.activeChip}>
                شدت: {SEVERITY_OPTIONS.find((s) => s.value === filters.severity)?.label}
                <button type="button" onClick={() => update({ severity: 'all' })}>
                  <X />
                </button>
              </Badge>
            )}
            <button
              type="button"
              className={styles.clearAll}
              onClick={() => onChange(DEFAULT_PATIENT_FILTERS)}
            >
              پاک کردن همه
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
