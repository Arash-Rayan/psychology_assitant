'use client';

import { ArrowUpDown, Filter, Search, X } from 'lucide-react';
import type { PatientDetail } from './PatientDetailView';
import { SCHEMA_TYPE_KEYS, type SchemaType } from './SchemaTypes';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  CHAT_TOPICS,
  DEFAULT_PATIENT_FILTERS,
  type ChatTopic,
  type PatientFilterState,
  type PatientSortOption,
  type PatientStatusFilter,
  hasActiveFilters,
  hasActivePatientPanelFilters,
} from '@/utils/filterPatients';
import {
  EMOTIONAL_STATE_BANDS,
  EMOTIONAL_TREND_OPTIONS,
  type EmotionalStateBand,
} from '@/utils/patientAgentFilter';
import type { IntensityTrend } from '@/utils/patientAgentTimeline';
import styles from './PatientFilters.module.css';

interface PatientFiltersProps {
  patients?: PatientDetail[];
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

const MOOD_LABELS: Record<EmotionalStateBand, string> = {
  low: 'پایین',
  moderate: 'متوسط',
  high: 'بالا',
};

const TREND_LABELS: Record<IntensityTrend, string> = {
  up: 'رو به افزایش',
  down: 'رو به کاهش',
  stable: 'پایدار',
};

function extraFilterCount(filters: PatientFilterState): number {
  return (
    filters.emotionalBands.length +
    filters.emotionalTrends.length +
    filters.topics.length +
    filters.schemas.length
  );
}

export function PatientFilters({
  filters,
  onChange,
  resultCount,
}: PatientFiltersProps) {
  const update = (patch: Partial<PatientFilterState>) => {
    onChange({ ...filters, ...patch });
  };

  const toggleIn = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  const toggleSchema = (schema: SchemaType) => {
    update({ schemas: toggleIn(filters.schemas, schema) });
  };

  const toggleTopic = (topic: ChatTopic) => {
    update({ topics: toggleIn(filters.topics, topic) });
  };

  const toggleEmotionalBand = (band: EmotionalStateBand) => {
    update({ emotionalBands: toggleIn(filters.emotionalBands, band) });
  };

  const toggleEmotionalTrend = (trend: IntensityTrend) => {
    update({ emotionalTrends: toggleIn(filters.emotionalTrends, trend) });
  };

  const extraActive = hasActivePatientPanelFilters(filters);
  const extraCount = extraFilterCount(filters);
  const active = hasActiveFilters(filters);

  const clearExtraFilters = () => {
    onChange({
      ...filters,
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

        <div className={styles.statusRow} role="group" aria-label="وضعیت مراجع">
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

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`${styles.filterTrigger} ${
                extraActive ? styles.filterTriggerActive : ''
              }`}
            >
              <Filter />
              فیلتر
              {extraCount > 0 && (
                <Badge variant="secondary" className={styles.countBadge}>
                  {extraCount}
                </Badge>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={8}
            className={`${styles.filterPopover} w-[min(22rem,calc(100vw-2rem))] max-h-[min(28rem,70vh)] overflow-y-auto p-3.5 bg-white`}
            dir="rtl"
          >
            <div className={styles.panelHeader}>
              <span>فیلترها</span>
              {extraActive && (
                <button type="button" className={styles.popoverClear} onClick={clearExtraFilters}>
                  پاک کردن
                </button>
              )}
            </div>

            <section className={styles.filterSection}>
              <h3 className={styles.sectionTitle}>خلق</h3>
              <div className={styles.chipRow}>
                {EMOTIONAL_STATE_BANDS.map((band) => (
                  <button
                    key={band.value}
                    type="button"
                    className={`${styles.chip} ${
                      filters.emotionalBands.includes(band.value) ? styles.chipActive : ''
                    }`}
                    onClick={() => toggleEmotionalBand(band.value)}
                  >
                    {MOOD_LABELS[band.value]}
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.filterSection}>
              <h3 className={styles.sectionTitle}>روند</h3>
              <div className={styles.chipRow}>
                {EMOTIONAL_TREND_OPTIONS.map((trend) => (
                  <button
                    key={trend.value}
                    type="button"
                    className={`${styles.chip} ${
                      filters.emotionalTrends.includes(trend.value) ? styles.chipActive : ''
                    }`}
                    onClick={() => toggleEmotionalTrend(trend.value)}
                  >
                    {TREND_LABELS[trend.value]}
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.filterSection}>
              <h3 className={styles.sectionTitle}>موضوع</h3>
              <div className={styles.chipRow}>
                {CHAT_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className={`${styles.chip} ${
                      filters.topics.includes(topic) ? styles.chipActive : ''
                    }`}
                    onClick={() => toggleTopic(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.filterSection}>
              <h3 className={styles.sectionTitle}>طرحواره</h3>
              <div className={styles.schemaChips}>
                {SCHEMA_TYPE_KEYS.map((schema) => (
                  <button
                    key={schema}
                    type="button"
                    className={`${styles.chip} ${styles.schemaChip} ${
                      filters.schemas.includes(schema) ? styles.chipActive : ''
                    }`}
                    onClick={() => toggleSchema(schema)}
                  >
                    {schema}
                  </button>
                ))}
              </div>
            </section>
          </PopoverContent>
        </Popover>

        <div className={styles.sortGroup}>
          <ArrowUpDown className={styles.rowIcon} />
          <select
            value={filters.sortBy}
            onChange={(e) => update({ sortBy: e.target.value as PatientSortOption })}
            className={styles.sortSelect}
            dir="rtl"
            aria-label="مرتب‌سازی"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.resultMeta}>{resultCount} مراجع</div>

        {active && (
          <div className={styles.activeChips}>
            {filters.search && (
              <Badge variant="outline" className={styles.activeChip}>
                {filters.search}
                <button type="button" onClick={() => update({ search: '' })} aria-label="حذف جستجو">
                  <X />
                </button>
              </Badge>
            )}
            {filters.status !== 'all' && (
              <Badge variant="outline" className={styles.activeChip}>
                {STATUS_OPTIONS.find((s) => s.value === filters.status)?.label}
                <button type="button" onClick={() => update({ status: 'all' })} aria-label="حذف وضعیت">
                  <X />
                </button>
              </Badge>
            )}
            {filters.emotionalBands.map((band) => (
              <Badge key={band} variant="outline" className={styles.activeChip}>
                خلق {MOOD_LABELS[band]}
                <button type="button" onClick={() => toggleEmotionalBand(band)} aria-label="حذف فیلتر خلق">
                  <X />
                </button>
              </Badge>
            ))}
            {filters.emotionalTrends.map((trend) => (
              <Badge key={trend} variant="outline" className={styles.activeChip}>
                {TREND_LABELS[trend]}
                <button type="button" onClick={() => toggleEmotionalTrend(trend)} aria-label="حذف فیلتر روند">
                  <X />
                </button>
              </Badge>
            ))}
            {filters.topics.map((topic) => (
              <Badge key={topic} variant="outline" className={styles.activeChip}>
                {topic}
                <button type="button" onClick={() => toggleTopic(topic)} aria-label="حذف موضوع">
                  <X />
                </button>
              </Badge>
            ))}
            {filters.schemas.map((schema) => (
              <Badge key={schema} variant="outline" className={styles.activeChip}>
                {schema}
                <button type="button" onClick={() => toggleSchema(schema)} aria-label="حذف طرحواره">
                  <X />
                </button>
              </Badge>
            ))}
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
