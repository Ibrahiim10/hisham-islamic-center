import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { usePageMeta } from '../../hooks/usePageMeta';
import { PUBLIC_SITE } from '../../constants/site';
import {
  WOMENS_CURRICULUM,
  WOMENS_ENVIRONMENT_POINTS,
  WOMENS_FEATURES,
  WOMENS_HERO_ALT,
  WOMENS_JOURNEY,
  WOMENS_LEARNING_ENV_ALT,
  WOMENS_SCHEDULE,
  WOMENS_SECTION_IMAGES,
} from '../../constants/womensSection';
import { CTASection } from '../components/CTASection';
import { SectionHeading } from '../components/SectionHeading';

const cardClass = 'rounded-lg border border-outline-variant/50 bg-white p-space-lg';

function scrollToCurriculum() {
  document.getElementById('womens-curriculum')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function WomensSectionPage() {
  usePageMeta(
    `Women's Section | ${PUBLIC_SITE.name}`,
    "Dedicated Islamic education for women — Qur'an, Tafsir, Fiqh, and Tajweed at Hisham Islamic Center, Nairobi.",
  );

  return (
    <div className="overflow-x-hidden bg-[#FAF7F2]">
      {/* Hero */}
      <section className="border-b border-outline-variant/25 px-space-md py-space-xl lg:px-space-lg lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-space-xl lg:grid-cols-2 lg:items-center lg:gap-space-lg">
          <div className="min-w-0">
            <p className="font-label-sm text-label-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">Women&apos;s Section</p>
            <h1 className="mt-space-sm font-headline-xl text-headline-xl text-brand-primary">Islamic Education for Women</h1>
            <p className="mt-space-md max-w-xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              A dedicated learning environment for women seeking structured Qur&apos;an and Islamic education in a calm, respectful, and supportive setting.
            </p>
            <div className="mt-space-lg flex flex-col gap-space-sm sm:flex-row sm:flex-wrap">
              <Link to="/admission" className="w-full sm:w-auto">
                <Button variant="accent" className="w-full justify-center sm:w-auto">
                  Apply for Women&apos;s Section
                </Button>
              </Link>
              <Button
                type="button"
                variant="subtle"
                className="w-full justify-center border border-outline-variant/60 bg-white sm:w-auto"
                onClick={scrollToCurriculum}
              >
                Explore Curriculum
              </Button>
            </div>
          </div>

          <div className="relative min-w-0">
            <div className="overflow-hidden rounded-lg border border-brand-primary/15 bg-white shadow-card">
              <img src={WOMENS_SECTION_IMAGES.hero} alt={WOMENS_HERO_ALT} className="aspect-[4/3] w-full object-cover" width={640} height={480} />
            </div>
            <figure
              className="absolute -bottom-4 left-4 max-w-[14rem] rounded-lg border border-brand-secondary/30 bg-[#FFFCF7] p-4 shadow-popover sm:-bottom-5 sm:left-6 sm:max-w-[16rem]"
              aria-label="Qur'anic reminder"
            >
              <blockquote className="font-arabic text-xl leading-relaxed text-brand-primary" dir="rtl" lang="ar">
                وَقُل رَّبِّ زِدْنِي عِلْمًا
              </blockquote>
              <figcaption className="mt-2 font-label-sm text-label-sm text-brand-secondary">Qur&apos;an 20:114</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Where Sacred Knowledge Meets Daily Life"
            description="The Women's Section provides structured Islamic education in a respectful learning environment — combining Qur'anic studies with practical Islamic knowledge that supports faith, character, and everyday living."
          />
          <ul className="mt-space-lg grid gap-space-md md:grid-cols-3">
            {WOMENS_FEATURES.map((feature) => (
              <li key={feature.title} className={cardClass}>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-primary/15 bg-[#FAF7F2] text-brand-primary">
                  <MaterialIcon name={feature.icon} className="text-[22px]" />
                </span>
                <h3 className="mt-space-md font-headline-md text-headline-md text-brand-primary">{feature.title}</h3>
                <p className="mt-2 font-body-md text-body-md text-on-surface-variant">{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Curriculum */}
      <section id="womens-curriculum" className="scroll-mt-24 border-t border-outline-variant/25 bg-white px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Our Women's Curriculum"
            description="A structured curriculum designed to build strong foundations in Qur'anic literacy and Islamic knowledge."
            align="center"
          />
          <ul className="mt-space-lg grid gap-space-md sm:grid-cols-2 lg:grid-cols-4">
            {WOMENS_CURRICULUM.map((item) => (
              <li key={item.title} className={`${cardClass} h-full`}>
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-brand-secondary/25 text-brand-secondary">
                  <MaterialIcon name={item.icon} className="text-[20px]" />
                </span>
                <h3 className="mt-space-md font-headline-md text-headline-md text-brand-primary">{item.title}</h3>
                <p className="mt-2 font-body-md text-body-md text-on-surface-variant">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Learning environment */}
      <section className="border-t border-outline-variant/25 px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto grid max-w-6xl gap-space-xl lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-lg border border-outline-variant/50 shadow-card">
            <img
              src={WOMENS_SECTION_IMAGES.learningEnvironment}
              alt={WOMENS_LEARNING_ENV_ALT}
              className="aspect-[4/3] w-full object-cover"
              width={640}
              height={480}
            />
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg text-brand-primary">A Calm Place to Learn</h2>
            <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">
              Classes are held in a dedicated space where women can focus on Qur&apos;an and Islamic studies with clarity and peace of mind.
            </p>
            <ul className="mt-space-lg space-y-3">
              {WOMENS_ENVIRONMENT_POINTS.map((point) => (
                <li key={point.text} className="flex items-start gap-3 font-body-md text-body-md text-on-surface">
                  <MaterialIcon name={point.icon} className="mt-0.5 shrink-0 text-[20px] text-brand-secondary" />
                  <span>{point.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="border-t border-outline-variant/25 bg-white px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Flexible Learning Schedule"
            description="Class schedules are structured to accommodate women's learning needs. Specific session times are shared during admission and placement."
          />
          <ul className="mt-space-lg grid gap-space-md md:grid-cols-3">
            {WOMENS_SCHEDULE.map((slot) => (
              <li key={slot.title} className={`${cardClass} text-center md:text-left`}>
                <h3 className="font-headline-md text-headline-md text-brand-primary">{slot.title}</h3>
                <p className="mt-2 font-body-md text-body-md text-on-surface-variant">{slot.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Journey */}
      <section className="border-t border-outline-variant/25 px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title="Women's Learning Journey" description="From enquiry to steady growth in Qur'anic and Islamic knowledge." />
          <ol className="mt-space-lg grid gap-space-md sm:grid-cols-2 lg:grid-cols-4">
            {WOMENS_JOURNEY.map((item) => (
              <li key={item.step} className={cardClass}>
                <span className="font-label-sm text-label-sm font-bold tracking-widest text-brand-secondary">{item.step}</span>
                <h3 className="mt-2 font-headline-md text-headline-md text-brand-primary">{item.title}</h3>
                <p className="mt-2 font-body-md text-body-md text-on-surface-variant">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contact strip */}
      <section className="border-t border-outline-variant/25 bg-white px-space-md py-space-lg lg:px-space-lg">
        <div className="mx-auto flex max-w-6xl flex-col gap-space-md sm:flex-row sm:items-center sm:justify-between">
          <address className="not-italic">
            <p className="font-headline-md text-headline-md text-brand-primary">{PUBLIC_SITE.name}</p>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">{PUBLIC_SITE.address.full}</p>
          </address>
          <a href={`tel:${PUBLIC_SITE.phoneTel}`} className="font-headline-md text-headline-md text-brand-secondary hover:text-brand-primary">
            {PUBLIC_SITE.phone}
          </a>
        </div>
      </section>

      <CTASection
        title="Begin Your Journey of Sacred Learning"
        description="Join Hisham Islamic Center's Women's Section and build your understanding of the Qur'an and Islamic knowledge in a dedicated learning environment."
        primaryLabel="Apply for Women's Section"
        primaryTo="/admission"
        secondaryLabel="Contact Us"
        secondaryTo="/contact"
        phone={PUBLIC_SITE.phone}
        phoneTel={PUBLIC_SITE.phoneTel}
      />
    </div>
  );
}
