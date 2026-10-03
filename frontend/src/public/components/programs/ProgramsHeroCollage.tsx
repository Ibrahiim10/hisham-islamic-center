import { PROGRAMS_PAGE_ASSETS } from '../../../constants/programsPage';

const imgFrame =
  'overflow-hidden rounded-lg border border-outline-variant/50 bg-white shadow-card transition-transform duration-300 motion-safe:hover:scale-[1.02]';

export function ProgramsHeroCollage() {
  return (
    <div className="relative mx-auto aspect-[4/3] max-w-lg lg:max-w-none">
      <div className={`absolute inset-0 top-0 left-0 right-[12%] bottom-[10%] ${imgFrame}`}>
        <img
          src={PROGRAMS_PAGE_ASSETS.tahfidh}
          alt="Tahfidh — Qur'an memorization program"
          className="h-full w-full object-cover"
          width={520}
          height={390}
        />
      </div>
      <div className={`absolute right-0 top-[8%] w-[42%] ${imgFrame}`}>
        <img
          src={PROGRAMS_PAGE_ASSETS.farbar}
          alt="Qaida Baghdadiyah — Farbar Arabic reading"
          className="aspect-[3/4] w-full object-cover object-top"
          width={200}
          height={260}
        />
      </div>
      <div className={`absolute bottom-0 left-[10%] w-[38%] ${imgFrame}`}>
        <img
          src={PROGRAMS_PAGE_ASSETS.women.hero}
          alt="Women's Section — Islamic education for women"
          className="aspect-[4/3] w-full object-cover"
          width={180}
          height={135}
        />
      </div>
    </div>
  );
}
