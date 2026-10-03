type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow ? (
        <p className="font-label-sm text-label-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 font-headline-lg text-headline-lg text-brand-primary">{title}</h2>
      {description ? <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">{description}</p> : null}
    </div>
  );
}
