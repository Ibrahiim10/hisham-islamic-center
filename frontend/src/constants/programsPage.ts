import { PROGRAMS } from './site';
import { QAIDA_BAGHDADIYAH_IMAGE } from './farbar';
import { TAHFIDH_HERO_IMAGE } from './tahfidh';
import { WOMENS_SECTION_IMAGES } from './womensSection';

export const PROGRAMS_PAGE_ASSETS = {
  tahfidh: TAHFIDH_HERO_IMAGE,
  farbar: QAIDA_BAGHDADIYAH_IMAGE,
  women: WOMENS_SECTION_IMAGES,
} as const;

export const PROGRAMS_PILLARS = [
  { num: '01', icon: 'menu_book', title: "Qur'an" },
  { num: '02', icon: 'school', title: 'Knowledge' },
  { num: '03', icon: 'favorite', title: 'Character' },
  { num: '04', icon: 'schedule', title: 'Consistency' },
] as const;

export const PROGRAMS_OVERVIEW = [
  {
    key: 'tahfidh',
    icon: 'auto_stories',
    title: 'Tahfidh',
    focus: "Qur'an Memorization & Islamic Studies",
    description: 'Structured hifz with sabaq, sabaqi, manzil, tajweed, and complementary Islamic studies.',
    subjects: ["Qur'an", 'Tajweed', 'Tawhid', 'Hadith', 'Fiqh'],
    to: PROGRAMS.tahfidh.path,
  },
  {
    key: 'farbar',
    icon: 'edit_note',
    title: 'Farbar',
    focus: 'Arabic Reading & Writing Foundations',
    description: 'Arabic letters, harakat, connecting letters, and reading practice with Qaida Baghdadiyah.',
    subjects: ['Arabic letters', 'Harakat', 'Reading', 'Writing', 'Pronunciation'],
    to: PROGRAMS.farbar.path,
  },
  {
    key: 'women',
    icon: 'diversity_3',
    title: "Women's Section",
    focus: 'Islamic Education for Women',
    description: 'Dedicated classes in a calm, respectful environment for women seeking Islamic knowledge.',
    subjects: ['Reading & Writing', 'Tafsir', 'Fiqh', 'Tajweed'],
    to: PROGRAMS.women.path,
  },
] as const;

export const PROGRAMS_INTRO_CARDS = [
  {
    title: PROGRAMS.tahfidh.title,
    summary: 'Qur\'an memorization pathway',
    image: TAHFIDH_HERO_IMAGE,
    alt: 'Tahfidh program at Hisham Islamic Center',
    to: PROGRAMS.tahfidh.path,
  },
  {
    title: PROGRAMS.farbar.title,
    summary: 'Arabic reading foundations',
    image: QAIDA_BAGHDADIYAH_IMAGE,
    alt: 'Qaida Baghdadiyah — Farbar program',
    to: PROGRAMS.farbar.path,
  },
  {
    title: PROGRAMS.women.title,
    summary: 'Structured learning for women',
    image: WOMENS_SECTION_IMAGES.hero,
    alt: "Women's Section at Hisham Islamic Center",
    to: PROGRAMS.women.path,
  },
] as const;
