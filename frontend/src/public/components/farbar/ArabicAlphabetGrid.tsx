import { ARABIC_ALPHABET } from '../../../constants/farbar';

export function ArabicAlphabetGrid() {
  return (
    <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-7 lg:gap-3">
      {ARABIC_ALPHABET.map((entry) => (
        <li
          key={entry.letter + entry.name}
          className="flex flex-col items-center justify-center rounded-lg border border-outline-variant/45 bg-white px-2 py-3 text-center"
        >
          <span className="font-arabic text-2xl leading-none text-brand-primary sm:text-3xl" lang="ar" dir="rtl">
            {entry.letter}
          </span>
          <span className="mt-2 font-label-sm text-label-sm text-brand-secondary">{entry.name}</span>
        </li>
      ))}
    </ul>
  );
}
