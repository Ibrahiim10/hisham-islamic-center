import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

type CTASectionProps = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  /** Tighter vertical padding for program pages */
  compact?: boolean;
  phone?: string;
  phoneTel?: string;
};

export function CTASection({
  title,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
  compact = false,
  phone,
  phoneTel,
}: CTASectionProps) {
  return (
    <section
      className={`bg-brand-primary px-space-md text-white lg:px-space-lg ${compact ? 'py-space-lg' : 'py-space-xl'}`}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-headline-lg text-headline-lg">{title}</h2>
        <p className="mt-space-sm font-body-lg text-body-lg text-white/85">{description}</p>
        <div className="mt-space-lg flex flex-col items-center justify-center gap-space-sm sm:flex-row">
          <Link to={primaryTo}>
            <Button variant="accent">{primaryLabel}</Button>
          </Link>
          {secondaryLabel && secondaryTo ? (
            <Link to={secondaryTo}>
              <Button variant="subtle" className="border border-white/30 bg-transparent text-white hover:bg-white/10">
                {secondaryLabel}
              </Button>
            </Link>
          ) : null}
        </div>
        {phone && phoneTel ? (
          <p className="mt-space-md font-body-md text-body-md text-white/80">
            <a href={`tel:${phoneTel}`} className="font-semibold text-brand-secondary hover:text-white">
              {phone}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
