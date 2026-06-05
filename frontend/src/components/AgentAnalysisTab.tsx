import { cn } from '@/components/ui/utils';
import { AgentOutputCountBadge } from '@/components/AgentOutputCountBadge';

interface AgentAnalysisTabProps {
  label: string;
  count: number;
  active?: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * تب تحلیل — شمارنده ستون جدا (چپ در RTL)، عنوان وسط باقی باکس.
 * بدون absolute تا هیچ‌وقت روی متن نیفتد.
 */
export function AgentAnalysisTab({
  label,
  count,
  active = false,
  onClick,
  className,
}: AgentAnalysisTabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      dir="rtl"
      className={cn(
        'flex min-h-[3.75rem] w-full items-stretch gap-0 rounded-xl border py-2 pl-1.5 pr-2 text-center transition-all duration-200 sm:min-h-[3.5rem]',
        active
          ? 'border-primary bg-primary/12 text-primary shadow-sm ring-1 ring-primary/15'
          : 'border-border bg-white text-foreground hover:border-primary/35 hover:bg-muted/30',
        className,
      )}
    >
      {/* عنوان — وسط باقی باکس */}
      <div className="flex min-w-0 flex-1 items-center justify-center px-0.5">
        <span
          className={cn(
            'line-clamp-3 w-full text-center text-[11px] font-medium leading-snug sm:text-xs sm:leading-tight',
            active ? 'text-primary' : 'text-foreground',
          )}
        >
          {label}
        </span>
      </div>

      {/* ستون شمارنده — سمت چپ در RTL */}
      <div className="flex w-7 shrink-0 items-start justify-center pt-0.5">
        <AgentOutputCountBadge count={count} variant="tab" />
      </div>
    </button>
  );
}
