import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { usePageMeta } from '../../hooks/usePageMeta';
import { HERO_ALPHABET_ROWS, QAIDA_BAGHDADIYAH_ALT } from '../../constants/farbar';
import { CAMPUS_MAPS_URL, HOME_KNOWLEDGE_VERSE, HOME_WHY_FAMILIES } from '../../constants/homePage';
import { PROGRAMS_PAGE_ASSETS, PROGRAMS_PILLARS } from '../../constants/programsPage';
import { PROGRAMS, PUBLIC_SITE } from '../../constants/site';
import { TAHFIDH_HADITH, TAHFIDH_HERO_ALT } from '../../constants/tahfidh';
import { WOMENS_LEARNING_ENV_ALT, WOMENS_SECTION_IMAGES } from '../../constants/womensSection';
import { CTASection } from '../components/CTASection';
import { HomeHeroImage } from '../components/home/HomeHeroImage';
import { SectionHeading } from '../components/SectionHeading';

const sectionY = 'px-space-md py-20 lg:px-space-lg lg:py-28';

export function HomePage() {
  usePageMeta(
    `${PUBLIC_SITE.name} | Nairobi`,
    'Structured Islamic education — Qur\'an memorization, Arabic reading, and character development at Hisham Islamic Center, Nairobi.',
  );

  return (
    <div className="overflow-x-hidden bg-[#FAF7F2]">
      {/* Hero */}
      <section className={`${sectionY} border-b border-outline-variant/20`}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="min-w-0">
            <p className="font-label-sm text-label-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">{PUBLIC_SITE.motto}</p>
            <h1 className="mt-space-md font-headline-xl text-[2.25rem] leading-[1.12] text-brand-primary sm:text-5xl lg:text-[3.25rem]">
              Knowledge.
              <br />
              Character.
              <br />
              A Brighter Tomorrow.
            </h1>
            <p className="mt-space-lg max-w-xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              {PUBLIC_SITE.name} provides structured Islamic education combining Qur&apos;an learning, Islamic studies, Arabic foundations, and character development for students and families in Nairobi.
            </p>
            <div className="mt-space-xl flex flex-col gap-space-sm sm:flex-row sm:flex-wrap">
              <Link to="/admission" className="w-full sm:w-auto">
                <Button variant="accent" className="w-full justify-center px-8 py-3 sm:w-auto">
                  Apply for Admission
                </Button>
              </Link>
              <Link to="/programs" className="w-full sm:w-auto">
                <Button variant="subtle" className="w-full justify-center border border-outline-variant/60 bg-white px-8 py-3 sm:w-auto">
                  Explore Programs
                </Button>
              </Link>
            </div>
          </div>
          <HomeHeroImage />
        </div>
      </section>

      {/* Hadith */}
      <section className="border-b border-outline-variant/20 bg-[#E8F0F0] px-space-md py-12 lg:px-space-lg lg:py-16">
        <figure className="mx-auto max-w-3xl text-center">
          <blockquote className="font-arabic text-2xl leading-relaxed text-brand-primary sm:text-3xl" dir="rtl" lang="ar">
            {TAHFIDH_HADITH.arabic}
          </blockquote>
          <figcaption className="mt-space-md space-y-1">
            <p className="font-body-lg text-body-lg italic text-on-surface-variant">&ldquo;{TAHFIDH_HADITH.english}&rdquo;</p>
            <p className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-brand-secondary">{TAHFIDH_HADITH.source}</p>
          </figcaption>
        </figure>
      </section>

      {/* About */}
      <section className={sectionY}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="font-label-sm text-label-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">About Hisham Islamic Center</p>
            <h2 className="mt-space-sm font-headline-lg text-headline-lg text-brand-primary sm:text-[2rem]">A Disciplined, Nurturing Learning Environment</h2>
            <p className="mt-space-lg font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              We focus on Qur&apos;an education, Islamic studies, Arabic learning, and tarbiyah — helping students grow in knowledge and character through structured programs.
            </p>
            <p className="mt-space-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
              Families choose pathways for Qur&apos;an memorization (Tahfidh), Arabic reading foundations (Farbar), and dedicated Islamic education for women — each with clear curriculum, practice, and teacher guidance.
            </p>
            <Link to="/about" className="mt-space-lg inline-flex items-center gap-1 font-label-md text-label-md font-semibold text-brand-secondary hover:text-brand-primary">
              Read our story <MaterialIcon name="arrow_forward" className="text-[18px]" />
            </Link>
          </div>
          <div className="order-1 overflow-hidden rounded-xl border border-outline-variant/50 shadow-card lg:order-2">
            <img
              src={WOMENS_SECTION_IMAGES.learningEnvironment}
              alt={WOMENS_LEARNING_ENV_ALT}
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 motion-safe:hover:scale-[1.02]"
              width={640}
              height={480}
            />
          </div>
        </div>
      </section>

      {/* Programs intro */}
      <section className={`${sectionY} border-t border-outline-variant/20 bg-white`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-label-sm text-label-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">Our Programs</p>
          <h2 className="mt-space-sm font-headline-lg text-headline-lg text-brand-primary sm:text-[2rem]">Three Learning Paths. One Foundation.</h2>
          <p className="mt-space-md font-body-lg text-body-lg text-on-surface-variant">
            Each program provides a structured pathway designed around Qur&apos;an, knowledge, practice and character.
          </p>
        </div>
      </section>

      {/* Tahfidh feature */}
      <section className="border-t border-outline-variant/20 bg-white px-space-md pb-20 lg:px-space-lg lg:pb-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="overflow-hidden rounded-xl border border-outline-variant/50 shadow-card">
            <img src={PROGRAMS_PAGE_ASSETS.tahfidh} alt={TAHFIDH_HERO_ALT} className="aspect-[4/3] w-full object-cover" width={640} height={480} />
          </div>
          <div>
            <h3 className="font-headline-xl text-headline-xl text-brand-primary">Tahfidh</h3>
            <p className="mt-1 font-title-sm text-title-sm text-brand-secondary">Qur&apos;an Memorization &amp; Islamic Studies</p>
            <p className="mt-space-lg font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              Structured Qur&apos;an memorization through Sabaq, Sabaqi, Manzil / Muraja&apos;ah and Tajweed, alongside Islamic studies and character development.
            </p>
            <ul className="mt-space-md flex flex-wrap gap-2">
              {['Qur\'an Memorization', 'Sabaq & Sabaqi', 'Muraja\'ah', 'Tajweed', 'Islamic Studies'].map((tag) => (
                <li key={tag} className="rounded-md border border-brand-primary/15 bg-[#FAF7F2] px-3 py-1.5 font-body-sm text-body-sm text-brand-primary">
                  {tag}
                </li>
              ))}
            </ul>
            <Link to={PROGRAMS.tahfidh.path} className="mt-space-xl inline-block">
              <Button variant="accent">Explore Tahfidh</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Farbar feature */}
      <section className={`${sectionY} border-t border-outline-variant/20`}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="order-2 lg:order-1">
            <h3 className="font-headline-xl text-headline-xl text-brand-primary">Farbar</h3>
            <p className="mt-1 font-title-sm text-title-sm text-brand-secondary">Arabic Reading &amp; Writing Foundations</p>
            <p className="mt-space-lg font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              Build strong Arabic reading foundations through letters, Harakat, pronunciation, connecting letters and structured reading practice using Qaida Baghdadiyah.
            </p>
            <div className="mt-space-md rounded-lg border border-brand-primary/15 bg-white p-space-md" dir="rtl" lang="ar">
              <div className="flex flex-wrap justify-center gap-2">
                {HERO_ALPHABET_ROWS[0].map((letter) => (
                  <span key={letter} className="font-arabic text-2xl text-brand-primary">
                    {letter}
                  </span>
                ))}
              </div>
            </div>
            <ul className="mt-space-md flex flex-wrap gap-2">
              {['Arabic Reading', 'Arabic Writing', 'Pronunciation', 'Harakat', 'Qaida Baghdadiyah'].map((tag) => (
                <li key={tag} className="rounded-md border border-brand-secondary/25 bg-white px-3 py-1.5 font-body-sm text-body-sm text-on-surface">
                  {tag}
                </li>
              ))}
            </ul>
            <Link to={PROGRAMS.farbar.path} className="mt-space-xl inline-block">
              <Button variant="accent">Explore Farbar</Button>
            </Link>
          </div>
          <div className="order-1 flex justify-center lg:order-2">
            <div className="w-full max-w-md overflow-hidden rounded-xl border border-brand-secondary/25 bg-white p-space-lg shadow-card">
              <img src={PROGRAMS_PAGE_ASSETS.farbar} alt={QAIDA_BAGHDADIYAH_ALT} className="mx-auto max-h-[380px] w-full object-contain" width={320} height={380} />
            </div>
          </div>
        </div>
      </section>

      {/* Women's Section feature */}
      <section className={`${sectionY} border-t border-outline-variant/20 bg-white`}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="grid grid-cols-2 gap-4">
            <img
              src={WOMENS_SECTION_IMAGES.hero}
              alt="Women's Section at Hisham Islamic Center"
              className="col-span-2 aspect-[16/10] w-full rounded-xl border border-outline-variant/50 object-cover shadow-sm"
              width={600}
              height={375}
            />
            <img
              src={WOMENS_SECTION_IMAGES.learningEnvironment}
              alt={WOMENS_LEARNING_ENV_ALT}
              className="aspect-square w-full rounded-xl border border-outline-variant/50 object-cover shadow-sm"
              width={280}
              height={280}
            />
            <img
              src={WOMENS_SECTION_IMAGES.quranStudy}
              alt="Women studying Qur'an"
              className="aspect-square w-full rounded-xl border border-outline-variant/50 object-cover shadow-sm"
              width={280}
              height={280}
            />
          </div>
          <div>
            <h3 className="font-headline-xl text-headline-xl text-brand-primary">Women&apos;s Section</h3>
            <p className="mt-1 font-title-sm text-title-sm text-brand-secondary">Dedicated Islamic Learning for Women</p>
            <p className="mt-space-lg font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              A dedicated learning environment offering structured Islamic education in a calm and respectful setting.
            </p>
            <p className="mt-space-md font-label-md text-label-md font-semibold uppercase tracking-wide text-brand-primary">Subjects</p>
            <ul className="mt-space-sm grid gap-2 sm:grid-cols-2">
              {['Reading & Writing', 'Tafsir', 'Fiqh', 'Tajweed'].map((s) => (
                <li key={s} className="rounded-md border border-outline-variant/40 bg-[#FAF7F2] px-3 py-2 font-body-md text-body-md">
                  {s}
                </li>
              ))}
            </ul>
            <Link to={PROGRAMS.women.path} className="mt-space-xl inline-block">
              <Button variant="accent">Explore Women&apos;s Section</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-brand-primary px-space-md py-20 text-white lg:px-space-lg lg:py-28">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-headline-lg text-headline-lg sm:text-[2rem]">More Than Lessons</h2>
          <p className="mx-auto mt-space-md max-w-2xl font-body-lg text-body-lg leading-relaxed text-white/85">
            At Hisham Islamic Center, education is built around knowledge, consistency, character and a strong relationship with the Qur&apos;an.
          </p>
          <ul className="mt-space-xl grid gap-space-md sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAMS_PILLARS.map((pillar) => (
              <li key={pillar.num} className="rounded-lg border border-white/15 bg-white/5 p-space-lg">
                <MaterialIcon name={pillar.icon} className="text-[28px] text-brand-secondary" />
                <p className="mt-space-md font-label-sm text-label-sm font-bold tracking-widest text-brand-secondary">{pillar.num}</p>
                <p className="mt-1 font-headline-md text-headline-md">{pillar.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why families choose */}
      <section className={sectionY}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="overflow-hidden rounded-xl border border-outline-variant/50 shadow-card">
            <img
              src={PROGRAMS_PAGE_ASSETS.tahfidh}
              alt=""
              className="aspect-[4/3] w-full object-cover object-center"
              width={640}
              height={480}
              aria-hidden
            />
          </div>
          <div>
            <SectionHeading title="Why Families Choose Hisham" description="An institution focused on Qur'an, knowledge, and character — not shortcuts." />
            <ul className="mt-space-lg space-y-space-md">
              {HOME_WHY_FAMILIES.map((item) => (
                <li key={item.title} className="flex gap-4 rounded-lg border border-outline-variant/40 bg-white p-space-md">
                  <MaterialIcon name={item.icon} className="shrink-0 text-[26px] text-brand-secondary" />
                  <div>
                    <h3 className="font-headline-md text-headline-md text-brand-primary">{item.title}</h3>
                    <p className="mt-1 font-body-md text-body-md text-on-surface-variant">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Second inspiration */}
      <section className="border-y border-outline-variant/20 bg-[#E8F0F0] px-space-md py-12 lg:px-space-lg lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-headline-md text-headline-md text-brand-primary">Knowledge That Shapes Character</h2>
          <figure className="mt-space-lg">
            <blockquote className="font-arabic text-2xl text-brand-primary sm:text-3xl" dir="rtl" lang="ar">
              {HOME_KNOWLEDGE_VERSE.arabic}
            </blockquote>
            <figcaption className="mt-space-md space-y-1">
              <p className="font-body-lg text-body-lg italic text-on-surface-variant">&ldquo;{HOME_KNOWLEDGE_VERSE.english}&rdquo;</p>
              <p className="font-label-sm text-label-sm font-semibold text-brand-secondary">{HOME_KNOWLEDGE_VERSE.source}</p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Location */}
      <section className={`${sectionY} bg-white`}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="font-label-sm text-label-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">Visit us</p>
            <h2 className="mt-space-sm font-headline-lg text-headline-lg text-brand-primary sm:text-[2rem]">Visit Hisham Islamic Center</h2>
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
            <div className="mt-space-xl flex flex-col gap-space-sm sm:flex-row">
              <a href={CAMPUS_MAPS_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="accent" className="w-full justify-center sm:w-auto">
                  Get Directions
                </Button>
              </a>
              <a href={`tel:${PUBLIC_SITE.phoneTel}`} className="w-full sm:w-auto">
                <Button variant="subtle" className="w-full justify-center border border-outline-variant/60 sm:w-auto">
                  Call Us
                </Button>
              </a>
            </div>
          </div>
          <div className="flex min-h-[240px] flex-col justify-center rounded-xl border border-outline-variant/50 bg-[#FAF7F2] p-space-xl text-center lg:min-h-[320px]">
            <MaterialIcon name="location_on" className="mx-auto text-[48px] text-brand-secondary" />
            <p className="mt-space-md font-body-md text-body-md text-on-surface-variant">Parklands, Nairobi</p>
            <p className="mt-1 font-label-md text-label-md font-semibold text-brand-primary">Iregi Road · Rodol Diamond</p>
            <Link to="/contact" className="mt-space-lg font-label-md text-label-md font-semibold text-brand-secondary hover:text-brand-primary">
              Send an enquiry →
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Begin Your Learning Journey"
        description="Choose the learning pathway that fits your needs and take the next step with Hisham Islamic Center."
        primaryLabel="Apply for Admission"
        primaryTo="/admission"
        secondaryLabel="Contact Us"
        secondaryTo="/contact"
      />
    </div>
  );
}
