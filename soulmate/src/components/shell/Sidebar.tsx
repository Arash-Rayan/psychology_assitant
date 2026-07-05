"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarDays,
  MessageCircle,
  BarChart3,
  Sparkles,
  BookOpen,
  Users,
  Settings,
  Star,
  type LucideIcon,
} from "lucide-react";
import { PRODUCT, SIDEBAR_NAV } from "@/lib/constants";
import styles from "./Sidebar.module.css";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  planner: CalendarDays,
  chat: MessageCircle,
  chart: BarChart3,
  sparkles: Sparkles,
  book: BookOpen,
  users: Users,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.logo}>
        <Star size={20} className={styles.logoIcon} />
        <span>
          <strong>{PRODUCT.name}</strong>
          <small>AI Calendar</small>
        </span>
      </Link>

      <nav className={styles.nav}>
        {SIDEBAR_NAV.map((item) => {
          const Icon = ICONS[item.icon] ?? Home;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className={cn(styles.navItem, active && styles.active)}>
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.aiBox}>
        <div className={styles.orb} aria-hidden />
        <p className={styles.aiTitle}>دستیار AI</p>
        <p className={styles.aiDesc}>درباره استرس، علایق، یا برنامه‌ات بپرس</p>
        <Link href="/journal" className={styles.aiBtn}>
          گفتگوی جدید
        </Link>
      </div>

      <div className={styles.user}>
        <div className={styles.avatar}>ر</div>
        <div>
          <strong>رایان</strong>
          <span>طرح روانصد</span>
        </div>
        <Settings size={16} className={styles.settings} />
      </div>
    </aside>
  );
}
