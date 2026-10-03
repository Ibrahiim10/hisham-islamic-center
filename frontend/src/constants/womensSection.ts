/** Public Women's Section page imagery and content. */
export const WOMENS_SECTION_IMAGES = {
  hero: '/assets/women-hero.jpg',
  learningEnvironment: '/assets/women-learning.jpg',
  quranStudy: '/assets/women-quran-study.jpg',
} as const;

export const WOMENS_HERO_ALT = 'Women studying Qur\'an and Islamic knowledge at Hisham Islamic Center';

export const WOMENS_LEARNING_ENV_ALT = 'Calm Islamic learning environment for women';

export const WOMENS_FEATURES = [
  {
    icon: 'diversity_3',
    title: 'Dedicated Sisterhood',
    description: 'A focused learning environment designed specifically for women.',
  },
  {
    icon: 'menu_book',
    title: "Qur'an & Islamic Studies",
    description: "Structured learning covering Qur'an, Tafsir, Fiqh and Tajweed.",
  },
  {
    icon: 'home_work',
    title: 'Practical Knowledge',
    description: 'Knowledge that helps students understand and apply Islam in everyday life.',
  },
] as const;

export const WOMENS_CURRICULUM = [
  {
    icon: 'edit_note',
    title: 'Reading & Writing',
    description: 'Arabic reading and writing foundations with practical exercises.',
  },
  {
    icon: 'auto_stories',
    title: 'Tafsir',
    description: "Understanding the meanings and lessons of the Qur'an.",
  },
  {
    icon: 'gavel',
    title: 'Fiqh',
    description: 'Essential Islamic rulings and practical guidance for everyday life.',
  },
  {
    icon: 'record_voice_over',
    title: 'Tajweed',
    description: 'Correct Qur\'an recitation, pronunciation and application of Tajweed rules.',
  },
] as const;

export const WOMENS_ENVIRONMENT_POINTS = [
  { icon: 'favorite', text: 'Respectful learning environment' },
  { icon: 'school', text: 'Qualified teachers' },
  { icon: 'calendar_month', text: 'Structured lessons' },
  { icon: 'chair', text: 'Comfortable setting' },
  { icon: 'menu_book', text: "Focused Qur'an and Islamic studies" },
] as const;

export const WOMENS_SCHEDULE = [
  {
    title: 'Morning Sessions',
    description: 'Structured morning learning sessions.',
  },
  {
    title: 'Afternoon Sessions',
    description: 'Focused lessons and Qur\'an studies.',
  },
  {
    title: 'Flexible Learning',
    description: 'Session arrangements can be communicated during admission.',
  },
] as const;

export const WOMENS_JOURNEY = [
  { step: '01', title: 'Admission', description: 'Submit your admission enquiry.' },
  { step: '02', title: 'Placement', description: 'Discuss your learning goals and appropriate placement.' },
  { step: '03', title: 'Learning', description: "Begin structured Qur'an and Islamic studies." },
  { step: '04', title: 'Growth', description: 'Develop stronger Qur\'anic understanding and Islamic knowledge.' },
] as const;
