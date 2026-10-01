import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type PageHeaderProps = {
  breadcrumbs?: string[];
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  breadcrumbs,
  title,
  subtitle,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-space-lg flex flex-col gap-space-md lg:flex-row lg:items-center lg:justify-between', className)}>
      <div className="flex flex-col gap-space-xs">
        {breadcrumbs?.length ? (
          <div className="flex flex-wrap items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb}-${index}`} className="inline-flex items-center gap-space-xs">
                {index > 0 ? <span className="font-semibold text-outline-variant">/</span> : null}
                <span className={index === breadcrumbs.length - 1 ? 'font-semibold text-brand-secondary' : 'font-medium'}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap items-baseline gap-space-sm">
          <h1 className="font-headline-xl text-headline-xl tracking-tight text-on-surface">{title}</h1>
          {badge ? (
            <span className="rounded-full bg-surface-container-high px-space-sm py-0.5 font-label-md text-label-md font-semibold text-on-surface-variant">
              {badge}
            </span>
          ) : null}
        </div>
        {subtitle ? <p className="font-body-sm text-body-sm text-on-surface-variant">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-space-sm">{actions}</div> : null}
    </div>
  );
}
