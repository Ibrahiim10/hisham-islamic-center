import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { MaterialIcon } from '../../components/ui/MaterialIcon';

type ProgramCardProps = {
  title: string;
  description: string;
  highlights: string[];
  to: string;
  accent?: 'teal' | 'gold';
};

export function ProgramCard({ title, description, highlights, to, accent = 'teal' }: ProgramCardProps) {
  const accentClass = accent === 'gold' ? 'border-brand-secondary/30 bg-[#faf6f1]' : 'border-brand-primary/15 bg-surface-container-lowest';

  return (
    <article className={`flex h-full flex-col rounded-2xl border p-space-lg shadow-sm ${accentClass}`}>
      <div className="mb-space-md flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
        <MaterialIcon name="menu_book" className="text-[26px]" />
      </div>
      <h3 className="font-headline-md text-headline-md text-brand-primary">{title}</h3>
      <p className="mt-space-sm flex-1 font-body-md text-body-md text-on-surface-variant">{description}</p>
      <ul className="mt-space-md space-y-1 font-body-sm text-body-sm text-on-surface">
        {highlights.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <MaterialIcon name="check_circle" className="mt-0.5 shrink-0 text-[16px] text-brand-secondary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-space-lg">
        <Link to={to}>
          <Button variant="subtle" className="w-full justify-center border border-outline-variant/50 bg-white/80">
            Learn more
          </Button>
        </Link>
      </div>
    </article>
  );
}
