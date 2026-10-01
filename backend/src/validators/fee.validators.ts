import { z } from 'zod';
import { StudentFeeStatus } from '../types/feeStatus.js';

const monthYearQuery = {
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
};

export const feeSummaryQuerySchema = z.object(monthYearQuery);

export const feeTrendQuerySchema = z.object({
  ...monthYearQuery,
  months: z.coerce.number().int().min(1).max(24).default(6),
});

export const feeAccountsQuerySchema = z.object({
  ...monthYearQuery,
  search: z.string().trim().optional(),
  classId: z.string().trim().optional(),
  status: z.enum([StudentFeeStatus.PAID, StudentFeeStatus.PARTIAL, StudentFeeStatus.UNPAID]).optional(),
});

export const feePaymentsQuerySchema = z.object({
  ...monthYearQuery,
  search: z.string().trim().optional(),
  classId: z.string().trim().optional(),
  studentId: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export const recordPaymentBodySchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  mpesaReference: z.string().trim().min(6, 'M-Pesa reference is required').max(40),
  paymentDate: z.coerce.date({ error: 'Enter a valid payment date' }),
  notes: z.string().trim().max(300).optional(),
});

export type RecordPaymentBody = z.infer<typeof recordPaymentBodySchema>;
