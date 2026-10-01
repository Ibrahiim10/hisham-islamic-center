export const UserRole = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  ACCOUNTANT: 'accountant',
  PARENT: 'parent',
  STUDENT: 'student',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const Gender = {
  MALE: 'male',
  FEMALE: 'female',
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const StudentStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type StudentStatus = (typeof StudentStatus)[keyof typeof StudentStatus];

export const AttendanceStatus = {
  PRESENT: 'present',
  ABSENT: 'absent',
} as const;

export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

export const PaymentMethod = {
  MPESA: 'mpesa',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const NotificationChannel = {
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
} as const;

export type NotificationChannel = (typeof NotificationChannel)[keyof typeof NotificationChannel];

export const NotificationStatus = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
} as const;

export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus];

export const IslamicContentType = {
  QURAN: 'quran',
  HADITH: 'hadith',
} as const;

export type IslamicContentType = (typeof IslamicContentType)[keyof typeof IslamicContentType];

export const QuranLessonType = {
  SABAQ: 'sabaq',
  MURAJAAH: 'murajaah',
} as const;

export type QuranLessonType = (typeof QuranLessonType)[keyof typeof QuranLessonType];

export const TeacherAssessment = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  NEEDS_IMPROVEMENT: 'needs_improvement',
  NEEDS_REVISION: 'needs_revision',
} as const;

export type TeacherAssessment = (typeof TeacherAssessment)[keyof typeof TeacherAssessment];
