import type { AttendanceStudent, PaymentRecord, StudentRecord } from './types';

export const dashboardSummary = {
  totalStudents: 482,
  presentToday: 456,
  absentToday: 26,
  feesOutstanding: 468_000,
  feesCollected: 2_688_000,
  collectionRate: 85.2,
  presentRate: 94.6,
  classBreakdown: { tahfidh: 184, farbar: 216, women: 82 },
};

export const studentsMock: StudentRecord[] = [
  {
    id: '1',
    regNo: 'REG-2024-089',
    fullName: 'Bilal Mohamed',
    gender: 'male',
    className: 'Tahfidh (Full-time)',
    parentPhone: '+254712345678',
    quranProgress: 'Juz 12 • Surah Yusuf',
    feeStatus: 'paid',
    status: 'active',
  },
  {
    id: '2',
    regNo: 'REG-2024-114',
    fullName: 'Fatima Zahra',
    gender: 'female',
    className: 'Women Section',
    parentPhone: '+254723456789',
    quranProgress: 'Juz 3 • Surah Al-Baqarah',
    feeStatus: 'paid',
    status: 'active',
  },
  {
    id: '3',
    regNo: 'REG-2024-032',
    fullName: 'Ibrahim Hassan',
    gender: 'male',
    className: 'Farbar (Part-time)',
    parentPhone: '+254734567890',
    quranProgress: 'Tajweed Level 2',
    feeStatus: 'partial',
    status: 'active',
  },
  {
    id: '4',
    regNo: 'REG-2024-201',
    fullName: 'Aisha Omar',
    gender: 'female',
    className: 'Tahfidh (Full-time)',
    parentPhone: '+254745678901',
    quranProgress: 'Juz 8 • Surah Al-Anfal',
    feeStatus: 'partial',
    status: 'active',
  },
  {
    id: '5',
    regNo: 'REG-2023-441',
    fullName: 'Ahmed Hassan (Demo)',
    gender: 'male',
    className: 'Tahfidh (Full-time)',
    parentPhone: '+254700000001',
    quranProgress: 'Juz 5 • Surah An-Nisa',
    feeStatus: 'unpaid',
    status: 'active',
  },
  {
    id: '6',
    regNo: 'REG-2023-512',
    fullName: 'Maryam Yusuf (Demo)',
    gender: 'female',
    className: 'Women Section',
    parentPhone: '+254700000003',
    quranProgress: 'Halaqah Book 1',
    feeStatus: 'overdue',
    status: 'active',
  },
];

export const recentPaymentsMock: PaymentRecord[] = [
  {
    id: 'p1',
    studentName: 'Bilal Mohamed',
    regNo: 'REG-2024-089',
    className: 'Tahfidh (Full-time)',
    amount: 8000,
    method: 'M-PESA',
    reference: 'QHK9283JD9',
    dateLabel: 'Today, 09:14 AM',
    status: 'verified',
  },
  {
    id: 'p2',
    studentName: 'Fatima Zahra',
    regNo: 'REG-2024-114',
    className: 'Women Section',
    amount: 3000,
    method: 'M-PESA',
    reference: 'RTY4710LK2',
    dateLabel: 'Today, 08:45 AM',
    status: 'verified',
  },
  {
    id: 'p3',
    studentName: 'Ibrahim Hassan',
    regNo: 'REG-2024-032',
    className: 'Farbar (Part-time)',
    amount: 6000,
    method: 'M-PESA',
    reference: 'PLM8831XZ5',
    dateLabel: 'Yesterday, 04:20 PM',
    status: 'verified',
  },
  {
    id: 'p4',
    studentName: 'Aisha Omar',
    regNo: 'REG-2024-201',
    className: 'Tahfidh (Full-time)',
    amount: 4000,
    method: 'BANK',
    reference: 'CBK-99012',
    dateLabel: 'Yesterday, 02:15 PM',
    status: 'partial',
  },
];

export const feeLedgerMock = [
  ...recentPaymentsMock,
  {
    id: 'p5',
    studentName: 'Ahmed Hassan (Demo)',
    regNo: 'REG-2023-441',
    className: 'Tahfidh (Full-time)',
    amount: 8000,
    method: 'M-PESA' as const,
    reference: 'DEVSEED001',
    dateLabel: 'Sep 5, 2025',
    status: 'verified' as const,
  },
];

export const attendanceClasses = ['Tahfidh (Full-time)', 'Farbar (Part-time)', 'Women Section'];

export const attendanceStudentsByClass: Record<string, AttendanceStudent[]> = {
  'Tahfidh (Full-time)': [
    { id: 'a1', fullName: 'Bilal Mohamed', regNo: 'REG-2024-089', status: 'present' },
    { id: 'a2', fullName: 'Aisha Omar', regNo: 'REG-2024-201', status: 'present' },
    { id: 'a3', fullName: 'Ahmed Hassan (Demo)', regNo: 'REG-2023-441', status: null },
  ],
  'Farbar (Part-time)': [
    { id: 'b1', fullName: 'Ibrahim Hassan', regNo: 'REG-2024-032', status: 'present' },
    { id: 'b2', fullName: 'Fatima Ali (Demo)', regNo: 'REG-2023-502', status: null },
  ],
  'Women Section': [
    { id: 'c1', fullName: 'Fatima Zahra', regNo: 'REG-2024-114', status: 'present' },
    { id: 'c2', fullName: 'Maryam Yusuf (Demo)', regNo: 'REG-2023-512', status: 'absent' },
  ],
};

export const quranLearningStudents = [
  {
    id: '1',
    name: 'Ahmed Hassan (Demo)',
    className: 'Tahfidh (Full-time)',
    currentJuz: 5,
    currentSurah: 'An-Nisa',
    arabicSurah: 'النساء',
    progress: 42,
    revision: 'Juz 1–4 weekly rotation',
    dailyLesson: 'Tajweed — Madd rules',
    islamicStudies: 'Fiqh of Taharah (Unit 2)',
    hadithTrack: '40 Hadith Nawawi — Hadith 1',
    arabicTrack: 'Madina Arabic Book 1, Lesson 8',
    notes: 'Strong memorization rhythm; focus on tajweed consistency.',
  },
  {
    id: '2',
    name: 'Bilal Mohamed',
    className: 'Tahfidh (Full-time)',
    currentJuz: 12,
    currentSurah: 'Yusuf',
    arabicSurah: 'يوسف',
    progress: 68,
    revision: 'Juz 10–11',
    dailyLesson: 'New memorization: ½ page',
    islamicStudies: 'Seerah — Year of Sorrow',
    hadithTrack: 'Riyadh as-Salihin — Intention',
    arabicTrack: 'Qasas an-Nabiyin — Chapter 3',
    notes: 'Ready for monthly hifz assessment.',
  },
];

export const islamicMotivation = {
  ayah: {
    label: 'Ayah of the Day',
    reference: 'Surah Ta-Ha (20:114)',
    arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    translation: 'And say: My Lord, increase me in knowledge.',
  },
  hadith: {
    label: 'Words of the Prophet ﷺ',
    reference: 'Sahih al-Bukhari 1; Sahih Muslim 1907',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    translation: 'Actions are judged by intentions, and every person will get what they intended.',
  },
};
