import { PROGRAMS } from './site';
import { PROGRAMS_PAGE_ASSETS } from './programsPage';

/** Qur'an 96:1 — hero overlay on About page. */
export const ABOUT_HERO_VERSE = {
  arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
  english: 'Read in the name of your Lord who created.',
  source: "Qur'an 96:1",
} as const;

export const ABOUT_PURPOSE_PRINCIPLES = [
  "Qur'an memorization and recitation",
  'Islamic studies and understanding',
  'Arabic reading and writing',
  'Character development and adab',
  'Structured learning and mentorship',
] as const;

export const ABOUT_APPROACH = [
  {
    num: '01',
    title: 'Structured Learning',
    description: 'Clear pathways and consistent progression.',
  },
  {
    num: '02',
    title: 'Islamic Foundations',
    description: "Qur'an, Hadith, Tawheed, Fiqh and other essential Islamic studies.",
  },
  {
    num: '03',
    title: 'Character & Adab',
    description: 'Developing discipline, respect, responsibility and good manners.',
  },
] as const;

export const ABOUT_PROGRAMS = [
  {
    title: 'Tahfidh',
    subtitle: "Qur'an Memorization & Islamic Studies",
    image: PROGRAMS_PAGE_ASSETS.tahfidh,
    imageAlt: 'Tahfidh program at Hisham Islamic Center',
    points: [
      "Qur'an memorization",
      'Sabaq',
      'Sabqi',
      "Manzil / Muraja'ah",
      'Tajweed',
      'Islamic studies including Tawheed, Hadith, Fiqh and Adab',
    ],
    to: PROGRAMS.tahfidh.path,
    cta: 'Explore Tahfidh',
  },
  {
    title: 'Farbar',
    subtitle: 'Arabic Reading Foundations',
    image: PROGRAMS_PAGE_ASSETS.farbar,
    imageAlt: 'Qaida Baghdadiyah — Farbar program',
    points: [
      'Arabic letters',
      'Qaida Baghdadiyah',
      'Harakat',
      'Connecting letters',
      'Arabic reading',
      'Pronunciation',
    ],
    to: PROGRAMS.farbar.path,
    cta: 'Explore Farbar',
  },
  {
    title: "Women's Section",
    subtitle: 'Dedicated Islamic Education for Women',
    image: PROGRAMS_PAGE_ASSETS.women.hero,
    imageAlt: "Women's Section at Hisham Islamic Center",
    points: ['Reading & Writing', 'Tafsir', 'Fiqh', 'Tajweed', 'Dedicated learning environment'],
    to: PROGRAMS.women.path,
    cta: "Explore Women's Section",
  },
] as const;

export const ABOUT_VALUES = [
  {
    label: 'KNOWLEDGE',
    description: "Building a strong foundation in Qur'an, Arabic and Islamic sciences.",
  },
  {
    label: 'CHARACTER',
    description: 'Developing discipline, adab, responsibility and respect.',
  },
  {
    label: 'COMMUNITY',
    description: 'Creating a supportive environment for students, families and the wider community.',
  },
] as const;

export const ABOUT_ENVIRONMENT_POINTS = [
  'Structured lessons',
  'Supportive teachers',
  "Qur'an-centered learning",
  'Character development',
  'Family-oriented environment',
] as const;
