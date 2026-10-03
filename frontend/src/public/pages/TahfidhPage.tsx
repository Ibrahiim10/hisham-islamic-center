import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { usePageMeta } from '../../hooks/usePageMeta';
import { PUBLIC_SITE } from '../../constants/site';
import {
  TAHFIDH_DAILY_ROUTINE,
  TAHFIDH_HADITH,
  TAHFIDH_HERO_ALT,
  TAHFIDH_HERO_IMAGE,
  TAHFIDH_HIFZ_ITEMS,
  TAHFIDH_ISLAMIC_STUDIES,
  TAHFIDH_JOURNEY_FOCUS,
  TAHFIDH_PATHWAY,
  TAHFIDH_WHY,
} from '../../constants/tahfidh';
import { CTASection } from '../components/CTASection';
import { SectionHeading } from '../components/SectionHeading';

const cardClass = 'rounded-lg border border-outline-variant/50 bg-white p-space-lg';

function scrollToProgram() {
  document.getElementById('tahfidh-journey')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function TahfidhPage() {
  usePageMeta(
    `Tahfidh Program | ${PUBLIC_SITE.name}`,
    "Qur'an memorization with sabaq, sabaqi, manzil, tajweed, and Islamic studies at Hisham Islamic Center.",
  );

  return (
    <div className="overflow-x-hidden bg-[#FAF7F2]">
      {/* Hero */}
      <section className="border-b border-outline-variant/25 px-space-md py-space-xl lg:px-space-lg lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-space-xl lg:grid-cols-2 lg:items-center lg:gap-space-lg">
          <div className="min-w-0 order-2 lg:order-1">
            <p className="font-label-sm text-label-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">Tahfidh Program</p>
            <h1 className="mt-space-sm font-headline-xl text-headline-xl text-brand-primary">Qur&apos;an Memorization with Purpose</h1>
            <p className="mt-space-md font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              Build a strong relationship with the Qur&apos;an through structured memorization, daily revision, Tajweed, and Islamic studies.
            </p>
            <div className="mt-space-lg flex flex-col gap-space-sm sm:flex-row sm:flex-wrap">
              <Link to="/admission" className="w-full sm:w-auto">
                <Button variant="accent" className="w-full justify-center sm:w-auto">
                  Apply for Tahfidh
                </Button>
              </Link>
              <Button
                type="button"
                variant="subtle"
                className="w-full justify-center border border-outline-variant/60 bg-white sm:w-auto"
                onClick={scrollToProgram}
              >
                Explore the Program
              </Button>
            </div>
          </div>
          <div className="order-1 min-w-0 lg:order-2">
            <div className="overflow-hidden rounded-lg border border-brand-primary/15 bg-white shadow-card">
              <img
                src={TAHFIDH_HERO_IMAGE}
                alt={TAHFIDH_HERO_ALT}
                className="aspect-[4/3] w-full object-cover"
                width={640}
                height={480}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hadith inspiration */}
      <section className="border-b border-outline-variant/25 bg-[#E8F0F0] px-space-md py-space-lg lg:px-space-lg">
        <figure className="mx-auto max-w-3xl text-center">
          <blockquote className="font-arabic text-2xl leading-relaxed text-brand-primary sm:text-3xl" dir="rtl" lang="ar">
            {TAHFIDH_HADITH.arabic}
          </blockquote>
          <figcaption className="mt-space-md space-y-1">
            <p className="font-body-md text-body-md italic text-on-surface-variant">&ldquo;{TAHFIDH_HADITH.english}&rdquo;</p>
            <p className="font-label-sm text-label-sm font-semibold text-brand-secondary">{TAHFIDH_HADITH.source}</p>
          </figcaption>
        </figure>
      </section>

      {/* Tahfidh journey intro */}
      <section id="tahfidh-journey" className="scroll-mt-24 px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="The Tahfidh Journey"
            description="The Tahfidh program guides students through memorization, revision, tajweed, and complementary Islamic studies — with tarbiyah that supports character and discipline."
          />
          <ul className="mt-space-lg flex flex-wrap gap-2">
            {TAHFIDH_JOURNEY_FOCUS.map((item) => (
              <li
                key={item}
                className="rounded-md border border-brand-primary/15 bg-white px-3 py-1.5 font-label-md text-label-md text-brand-primary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Learning pathway */}
      <section className="border-t border-outline-variant/25 bg-white px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title="Learning pathway" description="Five connected stages that support strong memorization and long-term retention." />
          <ol className="mt-space-lg grid gap-space-md sm:grid-cols-2 lg:grid-cols-5">
            {TAHFIDH_PATHWAY.map((stage) => (
              <li key={stage.step} className={`${cardClass} h-full`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-sm text-label-sm font-bold tracking-widest text-brand-secondary">{stage.step}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-brand-primary/15 bg-[#FAF7F2] text-brand-primary">
                    <MaterialIcon name={stage.icon} className="text-[20px]" />
                  </span>
                </div>
                <h3 className="mt-space-md font-headline-md text-headline-md text-brand-primary">{stage.title}</h3>
                <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{stage.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What students learn */}
      <section className="border-t border-outline-variant/25 px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title="What students learn" description="Hifz and recitation skills alongside foundational Islamic knowledge." />
          <div className="mt-space-lg grid gap-space-md lg:grid-cols-2">
            <article className={cardClass}>
              <h3 className="font-headline-md text-headline-md text-brand-primary">Hifz &amp; recitation</h3>
              <ul className="mt-space-md space-y-3">
                {TAHFIDH_HIFZ_ITEMS.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 font-body-md text-body-md text-on-surface-variant">
                    <MaterialIcon name={item.icon} className="shrink-0 text-[20px] text-brand-secondary" />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className={cardClass}>
              <h3 className="font-headline-md text-headline-md text-brand-primary">Islamic studies</h3>
              <ul className="mt-space-md space-y-3">
                {TAHFIDH_ISLAMIC_STUDIES.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 font-body-md text-body-md text-on-surface-variant">
                    <MaterialIcon name={item.icon} className="shrink-0 text-[20px] text-brand-secondary" />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Daily structure */}
      <section className="border-t border-outline-variant/25 bg-[#E8F0F0] px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            title="A Day in the Life of a Tahfidh Student"
            description="Students follow a structured routine that balances new memorization, revision, recitation, and Islamic studies — without rigid timetables published here; details are shared during admission and placement."
          />
          <ol className="relative mt-space-lg space-y-0 border-l border-brand-primary/20 pl-space-md">
            {TAHFIDH_DAILY_ROUTINE.map((block, index) => (
              <li key={block.title} className="relative pb-space-lg last:pb-0">
                <span
                  className="absolute -left-[calc(0.5rem+1px)] top-1 flex h-3 w-3 rounded-full border-2 border-brand-primary bg-[#E8F0F0]"
                  aria-hidden
                />
                <div className={`${cardClass} ml-2`}>
                  <div className="flex items-start gap-3">
                    <MaterialIcon name={block.icon} className="mt-0.5 shrink-0 text-[22px] text-brand-secondary" />
                    <div>
                      <p className="font-label-sm text-label-sm font-semibold text-brand-secondary">
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <h3 className="mt-0.5 font-headline-md text-headline-md text-brand-primary">{block.title}</h3>
                      <p className="mt-1 font-body-md text-body-md text-on-surface-variant">{block.detail}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Tajweed & recitation */}
      <section className="border-t border-outline-variant/25 px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto grid max-w-6xl gap-space-xl lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-lg border border-outline-variant/50 shadow-card">
            <img src={TAHFIDH_HERO_IMAGE} alt="" className="aspect-[4/3] w-full object-cover object-center" width={640} height={480} aria-hidden />
          </div>
          <div>
            <p className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-brand-secondary">Tajweed &amp; recitation</p>
            <h2 className="mt-2 font-headline-lg text-headline-lg text-brand-primary">Correct Recitation. Strong Memorization.</h2>
            <p className="mt-space-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
              Students receive structured tajweed and recitation guidance alongside memorization. Teachers listen to sabaq and revision, correct pronunciation, and help students develop clear, measured recitation as their hifz grows.
            </p>
          </div>
        </div>
      </section>

      {/* Why Tahfidh */}
      <section className="border-t border-outline-variant/25 bg-white px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title="Why Tahfidh" description="A disciplined path toward the Qur'an, knowledge, and character." align="center" />
          <ul className="mt-space-lg grid gap-space-md sm:grid-cols-2 lg:grid-cols-4">
            {TAHFIDH_WHY.map((item) => (
              <li key={item.title} className={`${cardClass} h-full`}>
                <MaterialIcon name={item.icon} className="text-[26px] text-brand-secondary" />
                <h3 className="mt-space-md font-headline-md text-headline-md text-brand-primary">{item.title}</h3>
                <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection
        title="Begin Your Tahfidh Journey"
        description="Give your child a structured path toward Qur'an memorization, Islamic knowledge, and strong character."
        primaryLabel="Apply for Tahfidh"
        primaryTo="/admission"
        secondaryLabel="Contact Us"
        secondaryTo="/contact"
      />
    </div>
  );
}
