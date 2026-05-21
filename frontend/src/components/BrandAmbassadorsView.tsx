'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  Users,
  UserPlus,
  ShoppingBag,
  Wallet,
  Trophy,
  Search,
  ChevronLeft,
  Award,
} from 'lucide-react';
import type { AmbassadorStatus, BrandAmbassador } from '@/types/brandAmbassador';
import {
  formatToman,
  getAmbassadorRankings,
  getBrandAmbassadors,
  getDashboardTotals,
} from '@/utils/mockBrandAmbassadors';
import { BrandAmbassadorDetailView } from './BrandAmbassadorDetailView';
import styles from './BrandAmbassadorsView.module.css';

const STATUS_LABELS: Record<AmbassadorStatus, string> = {
  active: 'فعال',
  inactive: 'غیرفعال',
  pending: 'در انتظار',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + parts[1][0];
  return name.slice(0, 2);
}

function rankBadgeClass(rank: number): string {
  if (rank === 1) return styles.rank1;
  if (rank === 2) return styles.rank2;
  if (rank === 3) return styles.rank3;
  return styles.rankDefault;
}

export function BrandAmbassadorsView() {
  const ambassadors = useMemo(() => getBrandAmbassadors(), []);
  const rankings = useMemo(() => getAmbassadorRankings(ambassadors), [ambassadors]);
  const totals = useMemo(() => getDashboardTotals(ambassadors), [ambassadors]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AmbassadorStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rankById = useMemo(() => {
    const map = new Map<string, number>();
    rankings.forEach((a) => map.set(a.id, a.rank));
    return map;
  }, [rankings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rankings.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.referralCode.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    });
  }, [rankings, search, statusFilter]);

  const selected = selectedId
    ? ambassadors.find((a) => a.id === selectedId)
    : undefined;

  const topFive = rankings.slice(0, 5);

  return (
    <div className={styles.root} dir="rtl">
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statCardPrimary}`}>
          <div className={`${styles.statIconWrap} ${styles.statIconPrimary}`}>
            <Users />
          </div>
          <div>
            <p className={styles.statLabel}>سفیران برند</p>
            <p className={styles.statValue}>
              {totals.totalAmbassadors.toLocaleString('fa-IR')}
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted-foreground)' }}>
                {' '}
                ({totals.activeCount.toLocaleString('fa-IR')} فعال)
              </span>
            </p>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardInvites}`}>
          <div className={`${styles.statIconWrap} ${styles.statIconInvites}`}>
            <UserPlus />
          </div>
          <div>
            <p className={styles.statLabel}>مراجعین دعوت‌شده</p>
            <p className={styles.statValue}>{totals.totalInvited.toLocaleString('fa-IR')}</p>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardSales}`}>
          <div className={`${styles.statIconWrap} ${styles.statIconSales}`}>
            <ShoppingBag />
          </div>
          <div>
            <p className={styles.statLabel}>فروش موفق</p>
            <p className={styles.statValue}>{totals.totalSales.toLocaleString('fa-IR')}</p>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardCommission}`}>
          <div className={`${styles.statIconWrap} ${styles.statIconCommission}`}>
            <Wallet />
          </div>
          <div>
            <p className={styles.statLabel}>مجموع پورسانت</p>
            <p className={styles.statValue} style={{ fontSize: '1.15rem' }}>
              {formatToman(totals.totalCommission)}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <aside className={styles.leaderboardCard}>
          <h3 className={styles.leaderboardTitle}>
            <Trophy />
            جدول رتبه‌بندی سفیران
          </h3>
          <ul className={styles.leaderboardList}>
            {topFive.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  className={`${styles.leaderboardItem} ${
                    a.rank <= 3 ? styles.leaderboardItemTop : ''
                  }`}
                  onClick={() => setSelectedId(a.id)}
                >
                  <span className={`${styles.rankBadge} ${rankBadgeClass(a.rank)}`}>
                    {a.rank === 1 ? <Award style={{ width: 14, height: 14 }} /> : a.rank}
                  </span>
                  <span
                    className={styles.leaderboardAvatar}
                    style={{ background: a.avatarColor }}
                  >
                    {getInitials(a.name)}
                  </span>
                  <span className={styles.leaderboardInfo}>
                    <span className={styles.leaderboardName}>{a.name}</span>
                    <span className={styles.leaderboardMeta}>
                      {a.successfulSalesCount.toLocaleString('fa-IR')} فروش ·{' '}
                      {a.invitedCount.toLocaleString('fa-IR')} دعوت
                    </span>
                  </span>
                  <span className={styles.leaderboardCommission}>
                    {formatToman(a.totalCommissionToman)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className={styles.tableCard}>
          <div className={styles.tableToolbar}>
            <h3 className={styles.tableTitle}>همه سفیران برند</h3>
            <div className={styles.toolbarRight}>
              <div className={styles.searchWrap}>
                <Search />
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder="جستجو نام، کد معرف..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as AmbassadorStatus | 'all')
                }
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
                <option value="pending">در انتظار</option>
              </select>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>رتبه</th>
                  <th>سفیر</th>
                  <th>کد معرف</th>
                  <th>دعوت</th>
                  <th>فروش</th>
                  <th>پورسانت</th>
                  <th>تبدیل</th>
                  <th>وضعیت</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={styles.emptyRow}>
                      سفیری با این فیلتر یافت نشد.
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id} onClick={() => setSelectedId(a.id)}>
                      <td>
                        <span className={`${styles.rankBadge} ${rankBadgeClass(a.rank)}`}>
                          {a.rank}
                        </span>
                      </td>
                      <td>
                        <div className={styles.ambassadorCell}>
                          <span
                            className={styles.tableAvatar}
                            style={{ background: a.avatarColor }}
                          >
                            {getInitials(a.name)}
                          </span>
                          {a.name}
                        </div>
                      </td>
                      <td>
                        <span className={styles.codeBadge}>{a.referralCode}</span>
                      </td>
                      <td>{a.invitedCount.toLocaleString('fa-IR')}</td>
                      <td>{a.successfulSalesCount.toLocaleString('fa-IR')}</td>
                      <td>{formatToman(a.totalCommissionToman)}</td>
                      <td>
                        <div className={styles.conversionBar}>
                          <div className={styles.conversionTrack}>
                            <div
                              className={styles.conversionFill}
                              style={{ width: `${a.conversionRate}%` }}
                            />
                          </div>
                          <span>{a.conversionRate}٪</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            a.status === 'active'
                              ? styles.statusActive
                              : a.status === 'inactive'
                                ? styles.statusInactive
                                : styles.statusPending
                          }`}
                        >
                          {STATUS_LABELS[a.status]}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.viewBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(a.id);
                          }}
                        >
                          جزئیات
                          <ChevronLeft />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <BrandAmbassadorDetailView
            key={selected.id}
            ambassador={selected}
            rank={rankById.get(selected.id)}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
