import { z } from 'zod';
import { Gender, StudentStatus } from '../types/enums.js';

const phoneSchema = z
  .string()
  .trim()
  .min(7, 'Parent phone number is too short')
  .max(20, 'Parent phone number is too long')
  .regex(/^[\d+\s()-]+$/, 'Enter a valid phone number');

const studentBodySchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required').max(120),
  dateOfBirth: z.coerce.date({ error: 'Enter a valid date of birth' }),
  gender: z.enum([Gender.MALE, Gender.FEMALE]),
  parentPhone: phoneSchema,
  address: z.string().trim().min(3, 'Address is required').max(300),
  classId: z.string().min(1, 'Program/class is required'),
});

export const createStudentBodySchema = studentBodySchema.superRefine((data, ctx) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (data.dateOfBirth > today) {
    ctx.addIssue({ code: 'custom', message: 'Date of birth cannot be in the future', path: ['dateOfBirth'] });
  }
});

export const updateStudentBodySchema = createStudentBodySchema;

export const listStudentsQuerySchema = z.object({
  search: z.string().trim().optional(),
  classId: z.string().trim().optional(),
  status: z.enum([StudentStatus.ACTIVE, StudentStatus.INACTIVE]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateStudentBody = z.infer<typeof createStudentBodySchema>;
export type UpdateStudentBody = z.infer<typeof updateStudentBodySchema>;
export type ListStudentsQuery = z.infer<typeof listStudentsQuerySchema>;
