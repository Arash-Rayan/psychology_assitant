import { cn } from '@/components/ui/utils';
import { AgentOutputCountBadge } from '@/components/AgentOutputCountBadge';

interface AgentAnalysisTabProps {
  label: string;
  count: number;
  active?: boolean;
  onClick: () => void;
  className?: string;
}

/** تب تحلیل — شمارنده سمت چپ، عنوان راست (RTL). */
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
      className={cn(
        'flex min-h-[3.75rem] w-full items-stretch rounded-xl border py-2 pr-2 pl-1.5 text-center transition-all duration-200 sm:min-h-[3.5rem]',
        active
          ? 'border-primary bg-primary/12 text-primary shadow-sm ring-1 ring-primary/15'
          : 'border-border bg-white text-foreground hover:border-primary/35 hover:bg-muted/30',
        className,
      )}
    >
      {/* LTR row: count pinned to physical left */}
      <div className="flex w-full min-w-0 items-center gap-1" dir="ltr">
        <div className="flex w-7 shrink-0 items-center justify-center">
          <AgentOutputCountBadge count={count} variant="tab" />
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center" dir="rtl">
          <span
            className={cn(
              'line-clamp-3 w-full text-center text-[11px] font-medium leading-snug sm:text-xs sm:leading-tight',
              active ? 'text-primary' : 'text-foreground',
            )}
          >
            {label}
          </span>
        </div>
      </div>
    </button>
  );
}
