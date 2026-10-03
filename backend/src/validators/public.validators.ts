import { z } from 'zod';
import { Gender } from '../types/enums.js';

export const admissionApplicationBodySchema = z.object({
  studentFullName: z.string().trim().min(2).max(200),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  gender: z.enum([Gender.MALE, Gender.FEMALE]),
  age: z.coerce.number().int().min(0).max(120),
  parentGuardianName: z.string().trim().min(2).max(200),
  contactPhone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(200),
  residentialAddress: z.string().trim().min(5).max(500),
  programStream: z.enum([
    'regular_tahfidh',
    'school_weekend',
    'school_weekday_evening',
    'womens_section',
  ]),
  paymentPreference: z.enum(['cash', 'mpesa']),
  notes: z.string().trim().max(2000).optional(),
});

export const contactInquiryBodySchema = z.object({
  fullName: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
});
