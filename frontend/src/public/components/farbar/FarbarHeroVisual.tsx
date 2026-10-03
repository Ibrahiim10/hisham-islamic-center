import { HERO_ALPHABET_ROWS, QAIDA_BAGHDADIYAH_ALT, QAIDA_BAGHDADIYAH_IMAGE } from '../../../constants/farbar';

export function FarbarHeroVisual() {
  return (
    <div className="min-w-0 space-y-space-md">
      <div className="rounded-xl border border-outline-variant/50 bg-white p-space-md shadow-card">
        <div className="flex flex-col gap-space-md sm:flex-row sm:items-start">
          <div className="mx-auto shrink-0 sm:mx-0">
            <img
              src={QAIDA_BAGHDADIYAH_IMAGE}
              alt={QAIDA_BAGHDADIYAH_ALT}
              className="h-auto max-h-[220px] w-full max-w-[160px] rounded-md border border-outline-variant/40 object-cover object-top sm:max-w-[140px]"
              width={140}
              height={220}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-brand-secondary">Qaida Baghdadiyah</p>
            <p className="mt-1 font-headline-md text-headline-md text-brand-primary">Arabic Reading Foundations</p>
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">Primary learning resource for letter recognition, harakat, and reading practice.</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-brand-primary/15 bg-white p-space-md" dir="rtl" lang="ar">
        <p className="mb-3 text-center font-label-sm text-label-sm font-semibold uppercase tracking-wider text-brand-secondary" dir="ltr" lang="en">
          Arabic alphabet
        </p>
        <div className="space-y-2">
          {HERO_ALPHABET_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {row.map((letter) => (
                <span
                  key={letter}
                  className="flex h-9 min-w-[2rem] items-center justify-center rounded-md border border-outline-variant/35 bg-[#FAF7F2] px-1.5 font-arabic text-xl text-brand-primary sm:h-10 sm:min-w-[2.25rem] sm:text-2xl"
                >
                  {letter}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
