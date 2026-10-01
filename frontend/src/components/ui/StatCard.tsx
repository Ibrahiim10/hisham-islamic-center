import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
  accent?: 'primary' | 'secondary' | 'error' | 'gold';
  className?: string;
};

const accentGlow: Record<NonNullable<StatCardProps['accent']>, string> = {
  primary: 'bg-primary-fixed/30',
  secondary: 'bg-primary-fixed-dim/20',
  error: 'bg-error-container/30',
  gold: 'bg-secondary-fixed/40',
};

export function StatCard({ label, value, icon, footer, accent = 'primary', className }: StatCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-card',
        className,
      )}
    >
      <div className={cn('pointer-events-none absolute -right-3 -top-3 h-20 w-20 rounded-full blur-xl', accentGlow[accent])} />
      <div>
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            {label}
          </span>
          {icon}
        </div>
        <div className="mt-space-sm">{value}</div>
      </div>
      {footer ? <div className="mt-space-sm pt-space-md">{footer}</div> : null}
    </div>
  );
}
