'use client';

import { motion } from 'motion/react';
import { X, ShoppingBag, Users, Receipt } from 'lucide-react';
import type { BrandAmbassador } from '@/types/brandAmbassador';
import { formatToman } from '@/utils/mockBrandAmbassadors';
import styles from './BrandAmbassadorDetailView.module.css';

interface BrandAmbassadorDetailViewProps {
  ambassador: BrandAmbassador;
  rank?: number;
  onClose: () => void;
}

const STATUS_LABELS = {
  active: 'فعال',
  inactive: 'غیرفعال',
  pending: 'در انتظار تأیید',
} as const;

const INVITE_LABELS = {
  converted: 'تبدیل‌شده',
  registered: 'ثبت‌نام',
  pending: 'در انتظار',
} as const;

const SALE_LABELS = {
  completed: 'تکمیل',
  pending: 'در انتظار',
  refunded: 'مرجوعی',
} as const;

const COMMISSION_LABELS = {
  paid: 'پرداخت‌شده',
  pending: 'در انتظار پرداخت',
} as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + parts[1][0];
  return name.slice(0, 2);
}

export function BrandAmbassadorDetailView({
  ambassador,
  rank,
  onClose,
}: BrandAmbassadorDetailViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.overlay}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 16 }}
        className={styles.modal}
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <div
              className={styles.avatar}
              style={{ background: ambassador.avatarColor }}
            >
              {getInitials(ambassador.name)}
            </div>
            <div className={styles.headerInfo}>
              <h2>
                {ambassador.name}
                {rank != null && rank <= 3 && (
                  <span style={{ marginRight: '0.5rem', fontSize: '0.875rem' }}>
                    🏆 رتبه {rank.toLocaleString('fa-IR')}
                  </span>
                )}
              </h2>
              <div className={styles.headerMeta}>
                <span>{ambassador.phone}</span>
                <span>·</span>
                <span>{ambassador.email}</span>
                <span>·</span>
                <span>عضویت: {ambassador.joinedAt}</span>
                <span className={styles.referralCode}>{ambassador.referralCode}</span>
              </div>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="بستن">
            <X />
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.statsRow}>
            <div className={styles.miniStat}>
              <p className={styles.miniStatLabel}>دعوت‌شده</p>
              <p className={styles.miniStatValue}>
                {ambassador.invitedCount.toLocaleString('fa-IR')}
              </p>
            </div>
            <div className={styles.miniStat}>
              <p className={styles.miniStatLabel}>فروش موفق</p>
              <p className={styles.miniStatValue}>
                {ambassador.successfulSalesCount.toLocaleString('fa-IR')}
              </p>
            </div>
            <div className={styles.miniStat}>
              <p className={styles.miniStatLabel}>پورسانت کل</p>
              <p className={styles.miniStatValue} style={{ fontSize: '0.95rem' }}>
                {formatToman(ambassador.totalCommissionToman)}
              </p>
            </div>
            <div className={styles.miniStat}>
              <p className={styles.miniStatLabel}>نرخ تبدیل</p>
              <p className={styles.miniStatValue}>
                {ambassador.conversionRate.toLocaleString('fa-IR')}٪
              </p>
            </div>
          </div>

          <div className={styles.summaryBox}>
            <p className={styles.summaryTitle}>خلاصه عملکرد</p>
            <p className={styles.summaryText}>{ambassador.performanceSummary}</p>
          </div>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Users />
              مراجعین دعوت‌شده ({ambassador.invitedCustomers.length.toLocaleString('fa-IR')})
            </div>
            {ambassador.invitedCustomers.length === 0 ? (
              <p className={styles.emptySection}>هنوز مراجعی ثبت نشده است.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>نام</th>
                      <th>تاریخ دعوت</th>
                      <th>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ambassador.invitedCustomers.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>{c.invitedAt}</td>
                        <td>
                          <span
                            className={`${styles.badge} ${
                              c.status === 'converted'
                                ? styles.badgeConverted
                                : c.status === 'registered'
                                  ? styles.badgeRegistered
                                  : styles.badgePending
                            }`}
                          >
                            {INVITE_LABELS[c.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <ShoppingBag />
              تاریخچه فروش
            </div>
            {ambassador.salesHistory.length === 0 ? (
              <p className={styles.emptySection}>فروشی ثبت نشده است.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>مشتری</th>
                      <th>محصول</th>
                      <th>مبلغ</th>
                      <th>پورسانت</th>
                      <th>تاریخ</th>
                      <th>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ambassador.salesHistory.map((s) => (
                      <tr key={s.id}>
                        <td>{s.customerName}</td>
                        <td>{s.productLabel}</td>
                        <td>{formatToman(s.amountToman)}</td>
                        <td>{formatToman(s.commissionToman)}</td>
                        <td>{s.date}</td>
                        <td>
                          <span
                            className={`${styles.badge} ${
                              s.status === 'completed'
                                ? styles.badgeCompleted
                                : s.status === 'refunded'
                                  ? styles.badgeRefunded
                                  : styles.badgePending
                            }`}
                          >
                            {SALE_LABELS[s.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Receipt />
              جزئیات پورسانت
            </div>
            {ambassador.commissionDetails.length === 0 ? (
              <p className={styles.emptySection}>پورسانتی ثبت نشده است.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>دوره</th>
                      <th>مبلغ</th>
                      <th>وضعیت</th>
                      <th>تاریخ پرداخت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ambassador.commissionDetails.map((c) => (
                      <tr key={c.id}>
                        <td>{c.period}</td>
                        <td>{formatToman(c.amountToman)}</td>
                        <td>
                          <span
                            className={`${styles.badge} ${
                              c.status === 'paid' ? styles.badgePaid : styles.badgePending
                            }`}
                          >
                            {COMMISSION_LABELS[c.status]}
                          </span>
                        </td>
                        <td>{c.paidAt ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}
