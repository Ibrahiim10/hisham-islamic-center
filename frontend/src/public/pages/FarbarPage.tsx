import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { usePageMeta } from '../../hooks/usePageMeta';
import {
  FARBAR_AUDIENCE,
  LEARNING_TOPICS,
  PRONUNCIATION_LETTER_GROUPS,
  QAIDA_BAGHDADIYAH_ALT,
  QAIDA_BAGHDADIYAH_IMAGE,
  READING_PROGRESSION,
} from '../../constants/farbar';
import { PUBLIC_SITE } from '../../constants/site';
import { CTASection } from '../components/CTASection';
import { SectionHeading } from '../components/SectionHeading';
import { ArabicAlphabetGrid } from '../components/farbar/ArabicAlphabetGrid';
import { FarbarHeroVisual } from '../components/farbar/FarbarHeroVisual';

const cardClass = 'rounded-lg border border-outline-variant/50 bg-white p-space-lg';

function scrollToProgression() {
  document.getElementById('reading-progression')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function FarbarPage() {
  usePageMeta(
    `Farbar Arabic Reading Program | ${PUBLIC_SITE.name}`,
    'Arabic reading foundations using Qaida Baghdadiyah — Farbar program at Hisham Islamic Center.',
  );

  return (
    <div className="overflow-x-hidden bg-[#FAF7F2]">
      {/* Hero */}
      <section className="border-b border-outline-variant/25 px-space-md py-space-xl lg:px-space-lg lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-space-xl lg:grid-cols-2 lg:items-center lg:gap-space-lg">
          <div className="min-w-0">
            <p className="font-label-sm text-label-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">Farbar</p>
            <h1 className="mt-space-sm font-headline-xl text-headline-xl text-brand-primary">Arabic Reading Foundations</h1>
            <p className="mt-space-md font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              Farbar builds the Arabic reading foundation students need before fluent Qur&apos;an recitation. Students develop letter recognition, pronunciation, Harakat, connected-letter reading, and reading practice through Qaida Baghdadiyah.
            </p>
            <div className="mt-space-lg flex flex-col gap-space-sm sm:flex-row sm:flex-wrap">
              <Link to="/admission" className="w-full sm:w-auto">
                <Button variant="accent" className="w-full justify-center sm:w-auto">
                  Apply for Farbar
                </Button>
              </Link>
              <Button type="button" variant="subtle" className="w-full justify-center border border-outline-variant/60 bg-white sm:w-auto" onClick={scrollToProgression}>
                Explore the Learning Path
              </Button>
            </div>
          </div>
          <FarbarHeroVisual />
        </div>
      </section>

      {/* Arabic alphabet */}
      <section className="px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Arabic Alphabet"
            description="Students begin by recognizing Arabic letters, their shapes, sounds, and correct pronunciation."
          />
          <div className="mt-space-lg">
            <ArabicAlphabetGrid />
          </div>
        </div>
      </section>

      {/* What students learn */}
      <section className="border-t border-outline-variant/25 px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title="What students learn" description="A structured foundation for confident Arabic and Qur'an reading." />
          <ul className="mt-space-lg grid gap-space-md sm:grid-cols-2 lg:grid-cols-3">
            {LEARNING_TOPICS.map((topic, index) => (
              <li key={topic.title} className={cardClass}>
                <span className="font-label-sm text-label-sm font-bold text-brand-secondary">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-1 font-headline-md text-headline-md text-brand-primary">{topic.title}</h3>
                <p className="mt-2 font-body-md text-body-md text-on-surface-variant">{topic.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Qaida Baghdadiyah */}
      <section className="border-t border-outline-variant/25 bg-white px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto grid max-w-6xl gap-space-xl lg:grid-cols-2 lg:items-center">
          <div className="flex justify-center lg:justify-start">
            <img
              src={QAIDA_BAGHDADIYAH_IMAGE}
              alt={QAIDA_BAGHDADIYAH_ALT}
              className="h-auto max-h-[420px] w-full max-w-sm rounded-lg border border-outline-variant/50 object-contain shadow-card"
              width={320}
              height={420}
            />
          </div>
          <div>
            <p className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-brand-secondary">Primary learning resource</p>
            <h2 className="mt-2 font-headline-lg text-headline-lg text-brand-primary">Learning with Qaida Baghdadiyah</h2>
            <p className="mt-space-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
              Students use Qaida Baghdadiyah as a foundation for learning Arabic letters, pronunciation, Harakat, connected letters, and progressive reading practice.
            </p>
            <p className="mt-space-md font-headline-md text-headline-md text-brand-primary">Qaida Baghdadiyah</p>
            <Link to="/admission" className="mt-space-lg inline-block w-full sm:w-auto">
              <Button variant="accent" className="w-full justify-center sm:w-auto">
                Apply for Farbar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reading progression */}
      <section id="reading-progression" className="scroll-mt-24 border-t border-outline-variant/25 px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Reading progression"
            description="Students move step by step from recognizing letters to reading Qur'anic text."
          />
          <ol className="mt-space-lg flex flex-col gap-space-md lg:flex-row lg:items-stretch">
            {READING_PROGRESSION.map((step, index) => (
              <li key={step} className={`flex-1 ${cardClass}`}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary font-label-md text-label-md font-bold text-white">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-space-md font-headline-md text-headline-md text-brand-primary">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pronunciation */}
      <section className="border-t border-outline-variant/25 bg-white px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            title="Building Correct Pronunciation"
            description="Students develop correct pronunciation as they progress through Arabic letters and reading exercises — building habits that support clear, confident reading before advanced tajweed study."
          />
          <div className="mt-space-lg rounded-xl border border-brand-primary/15 bg-[#FAF7F2] p-space-lg" dir="rtl" lang="ar">
            <div className="space-y-4">
              {PRONUNCIATION_LETTER_GROUPS.map((group, i) => (
                <div key={i} className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {group.map((letter) => (
                    <span
                      key={letter}
                      className="flex h-12 w-12 items-center justify-center rounded-lg border border-outline-variant/40 bg-white font-arabic text-2xl text-brand-primary sm:h-14 sm:w-14 sm:text-3xl"
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who is Farbar for */}
      <section className="border-t border-outline-variant/25 px-space-md py-space-xl lg:px-space-lg">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title="Who is Farbar for?" />
          <ul className="mt-space-lg grid gap-space-md md:grid-cols-3">
            {FARBAR_AUDIENCE.map((text) => (
              <li key={text} className={`${cardClass} text-center md:text-left`}>
                <p className="font-body-lg text-body-lg text-on-surface">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection
        compact
        title="Start with Farbar"
        description="Begin your journey toward confident Arabic and Qur'an reading."
        primaryLabel="Apply for Admission"
        primaryTo="/admission"
      />
    </div>
  );
}
