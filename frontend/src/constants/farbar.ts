/** Public Farbar page — Qaida asset and alphabet reference data. */
export const QAIDA_BAGHDADIYAH_IMAGE = '/assets/qaida-baghdadiyah.jpg';

export const QAIDA_BAGHDADIYAH_ALT = 'Qaida Baghdadiyah — Arabic reading foundations textbook';

export type ArabicLetterEntry = {
  letter: string;
  name: string;
};

/** 28 Arabic letters with common English transliteration names for learners. */
export const ARABIC_ALPHABET: ArabicLetterEntry[] = [
  { letter: 'ا', name: 'Alif' },
  { letter: 'ب', name: 'Ba' },
  { letter: 'ت', name: 'Ta' },
  { letter: 'ث', name: 'Tha' },
  { letter: 'ج', name: 'Jim' },
  { letter: 'ح', name: 'Ha' },
  { letter: 'خ', name: 'Kha' },
  { letter: 'د', name: 'Dal' },
  { letter: 'ذ', name: 'Dhal' },
  { letter: 'ر', name: 'Ra' },
  { letter: 'ز', name: 'Zay' },
  { letter: 'س', name: 'Sin' },
  { letter: 'ش', name: 'Shin' },
  { letter: 'ص', name: 'Sad' },
  { letter: 'ض', name: 'Dad' },
  { letter: 'ط', name: 'Taa' },
  { letter: 'ظ', name: 'Za' },
  { letter: 'ع', name: 'Ain' },
  { letter: 'غ', name: 'Ghain' },
  { letter: 'ف', name: 'Fa' },
  { letter: 'ق', name: 'Qaf' },
  { letter: 'ك', name: 'Kaf' },
  { letter: 'ل', name: 'Lam' },
  { letter: 'م', name: 'Mim' },
  { letter: 'ن', name: 'Nun' },
  { letter: 'ه', name: 'Ha' },
  { letter: 'و', name: 'Waw' },
  { letter: 'ي', name: 'Ya' },
];

/** Compact rows for hero letter preview (RTL within each row). */
export const HERO_ALPHABET_ROWS = [
  ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ'],
  ['د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص'],
  ['ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق'],
  ['ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'],
] as const;

export const PRONUNCIATION_LETTER_GROUPS = [
  ['ب', 'ت', 'ث'],
  ['ج', 'ح', 'خ'],
  ['س', 'ش'],
  ['ص', 'ض'],
] as const;

export const LEARNING_TOPICS = [
  {
    title: 'Arabic Letters',
    description: 'Recognize and identify the Arabic alphabet.',
  },
  {
    title: 'Letter Shapes',
    description: 'Understand how letters appear in different positions.',
  },
  {
    title: 'Harakat',
    description: 'Learn the basic vowel markings and their sounds.',
  },
  {
    title: 'Connecting Letters',
    description: 'Learn how Arabic letters join together to form words.',
  },
  {
    title: 'Correct Pronunciation',
    description: 'Develop accurate pronunciation and reading habits.',
  },
  {
    title: 'Reading Practice',
    description: 'Progress from individual letters to words and short reading exercises.',
  },
] as const;

export const READING_PROGRESSION = [
  'Arabic Letters',
  'Harakat',
  'Connected Letters',
  'Words & Short Sentences',
  "Qur'an Reading Preparation",
] as const;

export const FARBAR_AUDIENCE = [
  'Children beginning Arabic reading',
  'Students building Qur\'an reading foundations',
  'Learners who need stronger Arabic letter and pronunciation skills',
] as const;
