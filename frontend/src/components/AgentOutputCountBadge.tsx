import { cn } from '@/components/ui/utils';
import styles from '@/components/AgentOutputCountBadge.module.css';

interface AgentOutputCountBadgeProps {
  count: number;
  className?: string;
  /** tab = شمارندهٔ سمت چپ تب */
  variant?: 'default' | 'tab';
}

/** تعداد خروجی‌های agent */
export function AgentOutputCountBadge({
  count,
  className,
  variant = 'default',
}: AgentOutputCountBadgeProps) {
  const filled = count > 0;
  const isTab = variant === 'tab';
  const isWideCount = count >= 10;

  if (isTab) {
    return (
      <span
        className={cn(
          styles.tabBadge,
          isWideCount && styles.tabBadgeWide,
          !filled && styles.tabBadgeEmpty,
          className,
        )}
        aria-label={`${count} مورد`}
      >
        {count}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex min-w-[1.5rem] shrink-0 items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-bold leading-none tabular-nums',
        filled
          ? 'bg-primary/15 text-primary ring-1 ring-primary/20'
          : 'bg-muted text-muted-foreground ring-1 ring-border/80',
        className,
      )}
      aria-label={`${count} مورد`}
    >
      {count}
    </span>
  );
}
