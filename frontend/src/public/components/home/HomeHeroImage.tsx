import { TAHFIDH_HERO_ALT, TAHFIDH_HERO_IMAGE } from '../../../constants/tahfidh';

export function HomeHeroImage() {
  return (
    <div className="relative min-h-[280px] w-full lg:min-h-[min(520px,70vh)]">
      <div className="h-full overflow-hidden rounded-xl border border-brand-primary/15 bg-white shadow-card transition-shadow duration-300 motion-safe:hover:shadow-popover lg:absolute lg:inset-0">
        <img
          src={TAHFIDH_HERO_IMAGE}
          alt={TAHFIDH_HERO_ALT}
          className="h-full min-h-[280px] w-full object-cover lg:min-h-full"
          width={720}
          height={540}
          fetchPriority="high"
        />
      </div>
    </div>
  );
}
