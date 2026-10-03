import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { usePageMeta } from '../../hooks/usePageMeta';
import {
  ABOUT_APPROACH,
  ABOUT_ENVIRONMENT_POINTS,
  ABOUT_HERO_VERSE,
  ABOUT_PROGRAMS,
  ABOUT_PURPOSE_PRINCIPLES,
  ABOUT_VALUES,
} from '../../constants/aboutPage';
import { CAMPUS_MAPS_URL } from '../../constants/homePage';
import { PROGRAMS_PAGE_ASSETS } from '../../constants/programsPage';
import { PUBLIC_SITE } from '../../constants/site';
import { TAHFIDH_HERO_ALT, TAHFIDH_HERO_IMAGE } from '../../constants/tahfidh';
import { WOMENS_LEARNING_ENV_ALT } from '../../constants/womensSection';
import { CTASection } from '../components/CTASection';

const sectionY = 'px-space-md py-20 lg:px-space-lg lg:py-28';
const cardClass = 'rounded-lg border border-outline-variant/50 bg-white shadow-sm';

export function AboutPage() {
  usePageMeta(
    `About | ${PUBLIC_SITE.name}`,
    'Learn about Hisham Islamic Center — Qur\'an education, Islamic studies, Arabic, and character development in Nairobi.',
  );

  return (
    <div className="overflow-x-hidden bg-[#FAF7F2]">
      {/* Hero */}
      <section className={`${sectionY} border-b border-outline-variant/20`}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="min-w-0">
            <p className="font-label-sm text-label-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">About Hisham Islamic Center</p>
            <h1 className="mt-space-md font-arabic text-[2.25rem] leading-[1.15] text-brand-primary sm:text-5xl lg:text-[3rem]">
              Educating the Heart,
              <br />
              Mind &amp; Character.
            </h1>
            <p className="mt-space-lg max-w-xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              {PUBLIC_SITE.name} provides structured Islamic education rooted in Qur&apos;an learning, Islamic studies, Arabic foundations, and character development for students and families in Nairobi.
            </p>
            <div className="mt-space-xl flex flex-col gap-space-sm sm:flex-row sm:flex-wrap">
              <Link to="/programs" className="w-full sm:w-auto">
                <Button variant="accent" className="w-full justify-center px-8 sm:w-auto">
                  Explore Our Programs
                </Button>
              </Link>
              <Link to="/admission" className="w-full sm:w-auto">
                <Button variant="subtle" className="w-full justify-center border border-outline-variant/60 bg-white px-8 sm:w-auto">
                  Apply for Admission
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative min-w-0">
            <div className="overflow-hidden rounded-xl border border-brand-primary/15 bg-white shadow-card">
              <img
                src={TAHFIDH_HERO_IMAGE}
                alt={TAHFIDH_HERO_ALT}
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 motion-safe:hover:scale-[1.02]"
                width={640}
                height={480}
              />
            </div>
            <figure className="absolute bottom-4 left-4 max-w-[min(100%,15rem)] rounded-lg border border-brand-secondary/30 bg-[#FFFCF7] p-4 shadow-popover sm:bottom-6 sm:left-6">
              <blockquote className="font-arabic text-lg leading-relaxed text-brand-primary" dir="rtl" lang="ar">
                {ABOUT_HERO_VERSE.arabic}
              </blockquote>
              <figcaption className="mt-2 border-t border-outline-variant/30 pt-2">
                <p className="font-body-sm text-body-sm italic text-on-surface-variant">&ldquo;{ABOUT_HERO_VERSE.english}&rdquo;</p>
                <p className="mt-1 font-label-sm text-label-sm text-brand-secondary">{ABOUT_HERO_VERSE.source}</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Purpose */}
      <section className={`${sectionY} bg-white`}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-arabic text-headline-lg text-brand-primary sm:text-[2rem]">Our Educational Purpose</h2>
            <p className="mt-space-lg font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              We believe Islamic education should nurture more than academic knowledge. It should develop faith, discipline, character, confidence, and a lasting connection with the Qur&apos;an.
            </p>
          </div>
          <ol className="space-y-4">
            {ABOUT_PURPOSE_PRINCIPLES.map((item, index) => (
              <li key={item} className="flex gap-4 border-b border-outline-variant/30 pb-4 last:border-0 last:pb-0">
                <span className="font-label-md text-label-md font-bold text-brand-secondary">{String(index + 1).padStart(2, '0')}</span>
                <span className="font-body-lg text-body-lg text-on-surface">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Approach */}
      <section className="bg-brand-primary px-space-md py-20 text-white lg:px-space-lg lg:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-arabic text-headline-lg sm:text-[2rem]">Learning With Purpose</h2>
          <p className="mt-space-md max-w-3xl font-body-lg text-body-lg leading-relaxed text-white/85">
            Our programs combine structured learning, consistent practice, qualified instruction, and an environment that encourages discipline and good character.
          </p>
          <ul className="mt-space-xl grid gap-space-md md:grid-cols-3">
            {ABOUT_APPROACH.map((block) => (
              <li key={block.num} className="rounded-lg border border-white/15 bg-white/5 p-space-lg">
                <p className="font-label-sm text-label-sm font-bold tracking-widest text-brand-secondary">{block.num}</p>
                <h3 className="mt-2 font-headline-md text-headline-md">{block.title}</h3>
                <p className="mt-2 font-body-md text-body-md text-white/80">{block.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Programs */}
      <section className={sectionY}>
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="font-arabic text-headline-lg text-brand-primary sm:text-[2rem]">Our Learning Programs</h2>
            <p className="mt-space-md font-body-lg text-body-lg text-on-surface-variant">
              Three dedicated pathways designed for different stages and learning needs.
            </p>
          </div>
          <ul className="mt-space-xl space-y-16">
            {ABOUT_PROGRAMS.map((program, index) => (
              <li
                key={program.title}
                className={`grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16 ${index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}
              >
                <div className={`${cardClass} overflow-hidden p-0`}>
                  <img src={program.image} alt={program.imageAlt} className="aspect-[16/10] w-full object-cover" width={600} height={375} />
                </div>
                <div>
                  <h3 className="font-headline-xl text-headline-xl text-brand-primary">{program.title}</h3>
                  <p className="mt-1 font-title-sm text-title-sm text-brand-secondary">{program.subtitle}</p>
                  <ul className="mt-space-md space-y-2 font-body-md text-body-md text-on-surface-variant">
                    {program.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="text-brand-secondary">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={program.to} className="mt-space-lg inline-block">
                    <Button variant="accent">{program.cta}</Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-outline-variant/20 bg-white px-space-md py-20 lg:px-space-lg lg:py-28">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-arabic text-headline-lg text-brand-primary sm:text-[2rem]">Knowledge. Character. A Brighter Tomorrow.</h2>
          <ul className="mt-space-xl grid gap-space-lg md:grid-cols-3">
            {ABOUT_VALUES.map((value) => (
              <li key={value.label} className="border-t-2 border-brand-secondary/40 pt-space-lg">
                <p className="font-label-sm text-label-sm font-bold tracking-[0.12em] text-brand-secondary">{value.label}</p>
                <p className="mt-space-md font-body-lg text-body-lg leading-relaxed text-on-surface-variant">{value.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Learning environment */}
      <section className={sectionY}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className={`${cardClass} overflow-hidden p-0`}>
            <img
              src={PROGRAMS_PAGE_ASSETS.women.learningEnvironment}
              alt={WOMENS_LEARNING_ENV_ALT}
              className="aspect-[4/3] w-full object-cover"
              width={640}
              height={480}
            />
          </div>
          <div>
            <h2 className="font-arabic text-headline-lg text-brand-primary sm:text-[2rem]">A Place to Learn, Grow &amp; Reflect</h2>
            <p className="mt-space-lg font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              Hisham Islamic Center aims to provide a calm, structured environment where students can learn Qur&apos;an, develop Islamic knowledge and build strong character.
            </p>
            <ul className="mt-space-lg space-y-3">
              {ABOUT_ENVIRONMENT_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-3 font-body-md text-body-md text-on-surface">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Visit */}
      <section className={`${sectionY} border-t border-outline-variant/20 bg-white`}>
        <div className="mx-auto max-w-3xl text-center lg:max-w-6xl lg:text-left">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="font-arabic text-headline-lg text-brand-primary sm:text-[2rem]">Visit Hisham Islamic Center</h2>
              <address className="mt-space-lg not-italic font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                {PUBLIC_SITE.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <a href={`tel:${PUBLIC_SITE.phoneTel}`} className="mt-space-md block font-headline-md text-headline-md text-brand-primary">
                {PUBLIC_SITE.phone}
              </a>
            </div>
            <div className="mt-space-xl flex flex-col gap-space-sm sm:flex-row lg:mt-0 lg:justify-end">
              <a href={CAMPUS_MAPS_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="accent" className="w-full justify-center sm:w-auto">
                  Get Directions
                </Button>
              </a>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="subtle" className="w-full justify-center border border-outline-variant/60 sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Begin Your Learning Journey"
        description="Explore our programs or contact us to learn which pathway is right for you."
        primaryLabel="Explore Programs"
        primaryTo="/programs"
        secondaryLabel="Apply for Admission"
        secondaryTo="/admission"
      />
    </div>
  );
}
