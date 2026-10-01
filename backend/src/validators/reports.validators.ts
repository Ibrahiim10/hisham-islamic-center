import { z } from 'zod';
import { QuranLessonType } from '../types/enums.js';

const programSchema = z.enum(['tahfidh', 'farbar', 'women']);

const reportFiltersFieldsSchema = z.object({
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  studentId: z.string().trim().optional(),
  classId: z.string().trim().optional(),
  program: programSchema.optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(5000).default(25),
});

function refineReportDateRange(data: { dateFrom?: Date; dateTo?: Date }, ctx: z.RefinementCtx): void {
  if (data.dateFrom && data.dateTo && data.dateFrom > data.dateTo) {
    ctx.addIssue({ code: 'custom', message: 'Date From cannot be after Date To', path: ['dateTo'] });
  }
}

export const reportFiltersQuerySchema = reportFiltersFieldsSchema.superRefine(refineReportDateRange);

export const reportAttendanceQuerySchema = reportFiltersQuerySchema;

export const reportStudentsQuerySchema = reportFiltersQuerySchema.extend({
  status: z.enum(['active', 'inactive']).optional(),
});

export const reportFeesQuerySchema = reportFiltersQuerySchema.extend({
  paymentStatus: z.enum(['paid', 'partial', 'unpaid']).optional(),
});

export const reportQuranQuerySchema = reportFiltersQuerySchema.extend({
  type: z.enum([QuranLessonType.SABAQ, QuranLessonType.MURAJAAH]).optional(),
  surahNumber: z.coerce.number().int().min(1).max(114).optional(),
});

export const reportOverviewQuerySchema = reportFiltersFieldsSchema
  .omit({ page: true, limit: true, search: true })
  .superRefine(refineReportDateRange);

export type ReportFiltersQuery = z.infer<typeof reportFiltersQuerySchema>;
export type ReportStudentsQuery = z.infer<typeof reportStudentsQuerySchema>;
export type ReportFeesQuery = z.infer<typeof reportFeesQuerySchema>;
export type ReportQuranQuery = z.infer<typeof reportQuranQuerySchema>;
export type ReportOverviewQuery = z.infer<typeof reportOverviewQuerySchema>;
