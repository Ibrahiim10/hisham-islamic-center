import { BRAND } from './brand';

export const PUBLIC_SITE = {
  name: BRAND.name,
  motto: 'Knowledge • Character • A Brighter Tomorrow',
  tagline: 'Structured Islamic education in Nairobi',
  logoUrl: BRAND.logoUrl,
  logoAlt: BRAND.logoAlt,
  primary: BRAND.primary,
  secondary: BRAND.secondary,
  address: {
    lines: ['5th Parklands, Iregi Road', 'Rodol Diamond', 'Nairobi, Kenya'],
    full: '5th Parklands, Iregi Road, Rodol Diamond, Nairobi, Kenya',
  },
  phone: '+254 111 353 449',
  phoneTel: '+254111353449',
} as const;

export const PUBLIC_NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/tahfidh', label: 'Tahfidh' },
  { to: '/farbar', label: 'Farbar' },
  { to: '/womens-section', label: "Women's Section" },
  { to: '/admission', label: 'Admission' },
  { to: '/contact', label: 'Contact' },
] as const;

export const PROGRAMS = {
  tahfidh: {
    slug: 'tahfidh',
    title: 'Tahfidh',
    summary: 'Qur\'an memorization with sabak, sabqi, manzil (muraja\'ah), tajweed, and revision — alongside tawhid, hadith, fiqh, and adab.',
    path: '/tahfidh',
  },
  farbar: {
    slug: 'farbar',
    title: 'Farbar',
    summary: 'Arabic reading foundations using Qaida Baghdadiyah — letters, connection, pronunciation, and Qur\'an reading readiness.',
    path: '/farbar',
  },
  women: {
    slug: 'womens-section',
    title: "Women's Section",
    summary: 'Dedicated Islamic education for women — reading, tafsir, fiqh, and tajweed in a calm, private setting.',
    path: '/womens-section',
  },
} as const;
