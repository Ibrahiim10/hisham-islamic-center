import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { usePageMeta } from '../../hooks/usePageMeta';
import { HERO_ALPHABET_ROWS, QAIDA_BAGHDADIYAH_ALT } from '../../constants/farbar';
import {
  PROGRAMS_INTRO_CARDS,
  PROGRAMS_OVERVIEW,
  PROGRAMS_PAGE_ASSETS,
  PROGRAMS_PILLARS,
} from '../../constants/programsPage';
import { PROGRAMS, PUBLIC_SITE } from '../../constants/site';
import { TAHFIDH_HADITH, TAHFIDH_HERO_ALT } from '../../constants/tahfidh';
import { WOMENS_LEARNING_ENV_ALT, WOMENS_SECTION_IMAGES } from '../../constants/womensSection';
import { CTASection } from '../components/CTASection';
import { ProgramsHeroCollage } from '../components/programs/ProgramsHeroCollage';
import { SectionHeading } from '../components/SectionHeading';

const cardClass = 'rounded-lg border border-outline-variant/50 bg-white p-space-lg shadow-sm transition-shadow duration-300 motion-safe:hover:shadow-card';

function scrollToOverview() {
  document.getElementById('programs-overview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function ProgramsPage() {
  usePageMeta(
    `Programs | ${PUBLIC_SITE.name}`,
    "Tahfidh, Farbar, and Women's Section — structured Islamic education at Hisham Islamic Center, Nairobi.",
  );

  return (
    <div className="overflow-x-hidden bg-[#FAF7F2]">
      {/* Hero */}
      <section className="border-b border-outline-variant/25 px-space-md py-space-xl lg:px-space-lg lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-space-xl lg:grid-cols-2 lg:items-center lg:gap-space-lg">
          <div className="min-w-0">
            <p className="font-label-sm text-label-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">Our Programs</p>
            <h1 className="mt-space-sm font-headline-xl text-headline-xl leading-tight text-brand-primary md:text-[2.5rem]">
              Learning Paths Built Around Qur&apos;an, Knowledge &amp; Character
            </h1>
            <p className="mt-space-md font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              Explore structured Islamic education at Hisham Islamic Center, with dedicated learning pathways for Qur&apos;an memorization, Arabic foundations, and Islamic education for women.
            </p>
            <div className="mt-space-lg flex flex-col gap-space-sm sm:flex-row sm:flex-wrap">
              <Button type="button" variant="accent" className="w-full justify-center sm:w-auto" onClick={scrollToOverview}>
                Explore Programs
              </Button>
              <Link to="/admission" className="w-full sm:w-auto">
                <Button variant="subtle" className="w-full justify-center border border-outline-variant/60 bg-white sm:w-auto">
                  Apply for Admission
                </Button>
              </Link>
            </div>
          </div>
          <ProgramsHeroCollage />
        </div>
      </section>

      {/* Intro */}
      <section id="programs-overview" className="scroll-mt-24 px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-headline-lg text-headline-lg text-brand-primary">Three Paths. One Foundation.</h2>
          <p className="mt-space-sm font-body-lg text-body-lg text-on-surface-variant">
            Each program is designed around structured learning, consistent practice, Islamic knowledge, and character development.
          </p>
        </div>
        <ul className="mx-auto mt-space-lg grid max-w-6xl gap-space-md md:grid-cols-3">
          {PROGRAMS_INTRO_CARDS.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className={`${cardClass} group block h-full overflow-hidden p-0`}>
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
                    width={400}
                    height={250}
                  />
                </div>
                <div className="p-space-md">
                  <h3 className="font-headline-md text-headline-md text-brand-primary">{item.title}</h3>
                  <p className="mt-1 font-body-md text-body-md text-on-surface-variant">{item.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-1 font-label-md text-label-md font-semibold text-brand-secondary group-hover:text-brand-primary">
                    Explore <MaterialIcon name="arrow_forward" className="text-[16px]" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Tahfidh feature */}
      <section className="border-t border-outline-variant/25 bg-white px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto grid max-w-6xl gap-space-xl lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-lg border border-outline-variant/50 shadow-card">
            <img
              src={PROGRAMS_PAGE_ASSETS.tahfidh}
              alt={TAHFIDH_HERO_ALT}
              className="aspect-[4/3] w-full object-cover"
              width={640}
              height={480}
            />
          </div>
          <div>
            <p className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-brand-secondary">Tahfidh Program</p>
            <h2 className="mt-2 font-headline-lg text-headline-lg text-brand-primary">Qur&apos;an Memorization</h2>
            <p className="mt-space-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
              A structured Qur&apos;an memorization program built around Sabaq, Sabaqi, Manzil / Muraja&apos;ah, Tajweed, and continuous revision, supported by Islamic studies and character development.
            </p>
            <ul className="mt-space-md space-y-2 font-body-md text-body-md text-on-surface">
              {['Qur\'an Memorization', 'Sabaq & Sabaqi', "Manzil / Muraja'ah", 'Tajweed', 'Islamic Studies'].map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="text-brand-secondary">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Link to={PROGRAMS.tahfidh.path} className="mt-space-lg inline-block">
              <Button variant="accent">Explore Tahfidh</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Farbar feature */}
      <section className="border-t border-outline-variant/25 px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto grid max-w-6xl gap-space-xl lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-brand-secondary">Farbar Program</p>
            <h2 className="mt-2 font-headline-lg text-headline-lg text-brand-primary">Build Strong Arabic Reading Foundations</h2>
            <p className="mt-space-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
              Farbar introduces students to Arabic letters, pronunciation, reading and writing foundations using Qaida Baghdadiyah and structured practice.
            </p>
            <ul className="mt-space-md space-y-2 font-body-md text-body-md text-on-surface">
              {['Arabic Letters', 'Harakat', 'Connecting Letters', 'Arabic Reading', 'Arabic Writing', 'Pronunciation'].map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="text-brand-secondary">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-space-md rounded-lg border border-brand-primary/15 bg-white p-space-md" dir="rtl" lang="ar">
              <div className="flex flex-wrap justify-center gap-2">
                {HERO_ALPHABET_ROWS[0].map((letter) => (
                  <span key={letter} className="font-arabic text-2xl text-brand-primary">
                    {letter}
                  </span>
                ))}
              </div>
            </div>
            <Link to={PROGRAMS.farbar.path} className="mt-space-lg inline-block">
              <Button variant="accent">Explore Farbar</Button>
            </Link>
          </div>
          <div className="order-1 flex justify-center lg:order-2">
            <div className="max-w-sm overflow-hidden rounded-lg border border-brand-secondary/25 bg-white p-space-md shadow-card">
              <img
                src={PROGRAMS_PAGE_ASSETS.farbar}
                alt={QAIDA_BAGHDADIYAH_ALT}
                className="mx-auto h-auto max-h-[360px] w-full object-contain"
                width={280}
                height={360}
              />
              <p className="mt-space-md text-center font-label-md text-label-md font-semibold text-brand-primary">Qaida Baghdadiyah</p>
            </div>
          </div>
        </div>
      </section>

      {/* Women's Section feature */}
      <section className="border-t border-outline-variant/25 bg-white px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-space-xl lg:grid-cols-2 lg:items-start">
            <div className="grid grid-cols-2 gap-space-md">
              <img
                src={WOMENS_SECTION_IMAGES.hero}
                alt="Women's Section at Hisham Islamic Center"
                className="col-span-2 aspect-[16/10] w-full rounded-lg border border-outline-variant/50 object-cover shadow-sm"
                width={600}
                height={375}
              />
              <img
                src={WOMENS_SECTION_IMAGES.learningEnvironment}
                alt={WOMENS_LEARNING_ENV_ALT}
                className="aspect-square w-full rounded-lg border border-outline-variant/50 object-cover shadow-sm"
                width={280}
                height={280}
              />
              <img
                src={WOMENS_SECTION_IMAGES.quranStudy}
                alt="Women studying Qur'an"
                className="aspect-square w-full rounded-lg border border-outline-variant/50 object-cover shadow-sm"
                width={280}
                height={280}
              />
            </div>
            <div>
              <p className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-brand-secondary">Women&apos;s Section</p>
              <h2 className="mt-2 font-headline-lg text-headline-lg text-brand-primary">Islamic Education for Women</h2>
              <p className="mt-space-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
                A dedicated learning environment offering structured Islamic education in a calm, respectful setting.
              </p>
              <p className="mt-space-md font-label-md text-label-md font-semibold uppercase tracking-wide text-brand-primary">Curriculum</p>
              <ul className="mt-space-sm grid gap-2 sm:grid-cols-2">
                {['Reading & Writing', 'Tafsir', 'Fiqh', 'Tajweed'].map((subject) => (
                  <li key={subject} className="rounded-md border border-outline-variant/40 bg-[#FAF7F2] px-3 py-2 font-body-md text-body-md text-on-surface">
                    {subject}
                  </li>
                ))}
              </ul>
              <Link to={PROGRAMS.women.path} className="mt-space-lg inline-block">
                <Button variant="accent">Explore Women&apos;s Section</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick overview */}
      <section className="border-t border-outline-variant/25 px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title="Find the Right Learning Path" align="center" />
          <ul className="mt-space-lg grid gap-space-md lg:grid-cols-3">
            {PROGRAMS_OVERVIEW.map((program) => (
              <li key={program.key} className={`${cardClass} flex h-full flex-col`}>
                <MaterialIcon name={program.icon} className="text-[28px] text-brand-secondary" />
                <h3 className="mt-space-md font-headline-md text-headline-md text-brand-primary">{program.title}</h3>
                <p className="mt-1 font-label-sm text-label-sm font-semibold uppercase tracking-wide text-brand-secondary">Focus</p>
                <p className="font-body-md text-body-md text-on-surface">{program.focus}</p>
                <p className="mt-space-md flex-1 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{program.description}</p>
                <p className="mt-space-md font-label-sm text-label-sm font-semibold text-brand-primary">Key subjects</p>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{program.subjects.join(' · ')}</p>
                <Link to={program.to} className="mt-space-lg">
                  <Button variant="subtle" className="w-full justify-center border border-outline-variant/60">
                    Explore
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-brand-primary px-space-md py-space-xl text-white lg:px-space-lg">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-headline-lg text-headline-lg">More Than Lessons</h2>
          <p className="mx-auto mt-space-sm max-w-2xl font-body-lg text-body-lg text-white/85">
            At Hisham Islamic Center, learning is built around knowledge, consistency, character and a strong relationship with the Qur&apos;an.
          </p>
          <ul className="mt-space-xl grid gap-space-md sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAMS_PILLARS.map((pillar) => (
              <li key={pillar.num} className="rounded-lg border border-white/15 bg-white/5 p-space-lg">
                <MaterialIcon name={pillar.icon} className="text-[26px] text-brand-secondary" />
                <p className="mt-space-md font-label-sm text-label-sm font-bold tracking-widest text-brand-secondary">{pillar.num}</p>
                <p className="mt-1 font-headline-md text-headline-md">{pillar.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Hadith */}
      <section className="border-b border-outline-variant/25 bg-[#E8F0F0] px-space-md py-space-lg lg:px-space-lg">
        <figure className="mx-auto max-w-3xl text-center">
          <blockquote className="font-arabic text-2xl leading-relaxed text-brand-primary sm:text-[1.75rem]" dir="rtl" lang="ar">
            {TAHFIDH_HADITH.arabic}
          </blockquote>
          <figcaption className="mt-space-md space-y-1">
            <p className="font-body-md text-body-md italic text-on-surface-variant">&ldquo;{TAHFIDH_HADITH.english}&rdquo;</p>
            <p className="font-label-sm text-label-sm font-semibold text-brand-secondary">{TAHFIDH_HADITH.source}</p>
          </figcaption>
        </figure>
      </section>

      <CTASection
        title="Begin Your Learning Journey"
        description="Choose the program that fits your learning goals and take the next step with Hisham Islamic Center."
        primaryLabel="Apply for Admission"
        primaryTo="/admission"
        secondaryLabel="Contact Us"
        secondaryTo="/contact"
      />
    </div>
  );
}
