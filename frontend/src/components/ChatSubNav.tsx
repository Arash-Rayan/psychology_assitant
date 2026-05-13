'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, ClipboardList } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import styles from './ChatSubNav.module.css';

export function ChatSubNav() {
  const pathname = usePathname();
  const isAssistant = pathname === '/chat';
  const isPreConsult = pathname === '/chat/pre-consult';

  return (
    <nav className={styles.wrap} dir="rtl" aria-label="نوع گفتگو">
      <div className={styles.inner}>
        <Link
          href="/chat"
          className={cn(styles.tab, isAssistant && styles.tabActive)}
          aria-current={isAssistant ? 'page' : undefined}
        >
          <MessageCircle className={styles.tabIcon} aria-hidden />
          <span className={styles.tabLabel}>گفتگو با دستیار</span>
        </Link>
        <Link
          href="/chat/pre-consult"
          className={cn(styles.tab, isPreConsult && styles.tabActive)}
          aria-current={isPreConsult ? 'page' : undefined}
        >
          <ClipboardList className={styles.tabIcon} aria-hidden />
          <span className={styles.tabLabel}>پیش‌مشاوره</span>
        </Link>
      </div>
    </nav>
  );
}
