import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type SectionCardProps = {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  padded?: boolean;
};

export function SectionCard({
  eyebrow,
  title,
  action,
  children,
  className,
  bodyClassName,
  padded = true,
}: SectionCardProps) {
  return (
    <section className={cn('overflow-hidden rounded-xl bg-surface-container-lowest shadow-card', className)}>
      <div className={cn('flex flex-col justify-between gap-space-sm sm:flex-row sm:items-center', padded ? 'p-space-lg pb-space-sm' : 'px-space-lg pt-space-lg')}>
        <div>
          {eyebrow ? (
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
              {eyebrow}
            </span>
          ) : null}
          <h2 className="font-title-lg text-title-lg tracking-tight text-on-surface">{title}</h2>
        </div>
        {action}
      </div>
      <div className={cn(padded ? 'p-space-lg pt-0' : '', bodyClassName)}>{children}</div>
    </section>
  );
}
