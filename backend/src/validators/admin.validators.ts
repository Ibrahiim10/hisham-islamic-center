import { z } from 'zod';
import { UserRole } from '../types/enums.js';

const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must include a lowercase letter')
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[0-9]/, 'Password must include a number');

export const createAdminBodySchema = z
  .object({
    fullName: z.string().trim().min(1, 'Full name is required').max(120),
    email: z.string().trim().email('Enter a valid email address'),
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    role: z.enum([UserRole.ADMIN]).default(UserRole.ADMIN),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({ code: 'custom', message: 'Passwords do not match', path: ['confirmPassword'] });
    }
  });

export const updateAdminBodySchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(120),
  email: z.string().trim().email('Enter a valid email address'),
  role: z.enum([UserRole.ADMIN]).default(UserRole.ADMIN),
  isActive: z.boolean(),
});

export const changeAdminPasswordBodySchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({ code: 'custom', message: 'Passwords do not match', path: ['confirmPassword'] });
    }
    if (data.currentPassword === data.newPassword) {
      ctx.addIssue({ code: 'custom', message: 'New password must differ from current password', path: ['newPassword'] });
    }
  });

export type CreateAdminBody = z.infer<typeof createAdminBodySchema>;
export type UpdateAdminBody = z.infer<typeof updateAdminBodySchema>;
export type ChangeAdminPasswordBody = z.infer<typeof changeAdminPasswordBodySchema>;
