/** Public Tahfidh program page content and assets. */
export const TAHFIDH_HERO_IMAGE = '/assets/tahfidh-hero.jpg';

export const TAHFIDH_HERO_ALT = 'Students engaged in Qur\'an memorization and Islamic learning at Hisham Islamic Center';

export const TAHFIDH_HADITH = {
  arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
  english: 'The best of you are those who learn the Qur\'an and teach it.',
  source: 'Sahih al-Bukhari',
} as const;

export const TAHFIDH_JOURNEY_FOCUS = [
  "Qur'an memorization",
  'Sabak',
  'Sabaqi',
  "Manzil / Muraja'ah",
  'Tajweed',
  'Continuous revision',
  'Islamic studies',
  'Character development',
] as const;

export const TAHFIDH_PATHWAY = [
  {
    step: '01',
    icon: 'auto_stories',
    title: 'New Memorization',
    description: 'Students build their daily memorization routine.',
  },
  {
    step: '02',
    icon: 'menu_book',
    title: 'Sabaq',
    description: "Daily presentation of newly memorized Qur'an.",
  },
  {
    step: '03',
    icon: 'replay',
    title: 'Sabaqi',
    description: 'Revision of recently memorized portions.',
  },
  {
    step: '04',
    icon: 'history_edu',
    title: "Manzil / Muraja'ah",
    description: "Systematic revision of previously memorized Qur'an.",
  },
  {
    step: '05',
    icon: 'cycle',
    title: 'Continuous Revision',
    description: 'Long-term retention and strengthening of memorization.',
  },
] as const;

export const TAHFIDH_HIFZ_ITEMS = [
  { icon: 'menu_book', label: "Qur'an Memorization" },
  { icon: 'edit_note', label: 'Sabaq' },
  { icon: 'replay', label: 'Sabaqi' },
  { icon: 'history_edu', label: "Manzil / Muraja'ah" },
  { icon: 'record_voice_over', label: 'Tajweed' },
  { icon: 'cycle', label: 'Continuous Revision' },
] as const;

export const TAHFIDH_ISLAMIC_STUDIES = [
  { icon: 'mosque', label: 'Tawhid' },
  { icon: 'auto_stories', label: 'Hadith' },
  { icon: 'gavel', label: 'Fiqh' },
  { icon: 'person', label: 'Sirah' },
  { icon: 'favorite', label: 'Character & Adab' },
] as const;

export const TAHFIDH_DAILY_ROUTINE = [
  { icon: 'menu_book', title: "Qur'an memorization", detail: 'New lesson portions with teacher guidance.' },
  { icon: 'record_voice_over', title: 'Recitation', detail: 'Listening, repetition, and tarteel practice.' },
  { icon: 'replay', title: 'Revision', detail: 'Sabaqi, manzil, and continuous muraja\'ah.' },
  { icon: 'school', title: 'Islamic studies', detail: 'Tawhid, hadith, fiqh, and sirah foundations.' },
  { icon: 'volunteer_activism', title: 'Character development', detail: 'Adab, discipline, and tarbiyah throughout the week.' },
] as const;

export const TAHFIDH_WHY = [
  {
    icon: 'favorite',
    title: 'Strong Qur\'an connection',
    description: 'Daily engagement with the Book of Allah through memorization and reflection.',
  },
  {
    icon: 'schedule',
    title: 'Consistent memorization and revision',
    description: 'A structured cycle of sabaq, sabaqi, and manzil for lasting retention.',
  },
  {
    icon: 'record_voice_over',
    title: 'Tajweed and recitation development',
    description: 'Correct pronunciation and recitation habits alongside hifz progress.',
  },
  {
    icon: 'school',
    title: 'Islamic knowledge and character',
    description: 'Complementary studies that nurture faith, understanding, and adab.',
  },
] as const;
