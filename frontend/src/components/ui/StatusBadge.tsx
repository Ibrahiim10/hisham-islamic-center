import { cn } from '../../utils/cn';
import type { FeeStatus } from '../../data/mock/types';

type BadgeTone = FeeStatus | 'verified' | 'pending' | 'active' | 'inactive' | 'present' | 'absent';

const toneClasses: Record<BadgeTone, string> = {
  paid: 'bg-success-bg text-success-text border border-success-border',
  partial: 'bg-warning-bg text-warning-text border border-warning-border',
  unpaid: 'bg-warning-bg text-warning-text border border-warning-border',
  overdue: 'bg-danger-bg text-danger-text border border-danger-border',
  verified: 'bg-surface-container-high text-primary-container',
  pending: 'bg-secondary-fixed text-on-secondary-fixed',
  active: 'bg-success-bg text-success-text border border-success-border',
  inactive: 'bg-surface-container text-on-surface-variant border border-outline-variant/60',
  present: 'bg-success-bg text-success-text border border-success-border',
  absent: 'bg-danger-bg text-danger-text border border-danger-border',
};

const labels: Partial<Record<BadgeTone, string>> = {
  paid: 'Paid',
  partial: 'Partial',
  unpaid: 'Unpaid',
  overdue: 'Overdue',
  verified: 'Verified',
  pending: 'Pending',
  active: 'Active',
  inactive: 'Inactive',
  present: 'Present',
  absent: 'Absent',
};

type StatusBadgeProps = {
  tone: BadgeTone;
  label?: string;
  className?: string;
};

export function StatusBadge({ tone, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center rounded-full px-2.5 font-label-sm text-label-sm font-semibold',
        toneClasses[tone],
        className,
      )}
    >
      {label ?? labels[tone]}
    </span>
  );
}
