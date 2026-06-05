import { cn } from '@/components/ui/utils';

interface AgentOutputCountBadgeProps {
  count: number;
  className?: string;
  /** tab = شمارندهٔ گوشهٔ تب */
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

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center font-semibold leading-none tabular-nums',
        isTab
          ? 'h-5 min-w-5 rounded-full px-1 text-[10px]'
          : 'min-w-[1.5rem] rounded-md px-1.5 py-0.5 text-[10px] font-bold',
        isTab
          ? filled
            ? 'border border-primary/25 bg-white text-primary shadow-[0_1px_4px_rgba(124,58,237,0.18)] ring-2 ring-white'
            : 'border border-border/70 bg-muted/70 text-muted-foreground shadow-sm ring-2 ring-white'
          : filled
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
