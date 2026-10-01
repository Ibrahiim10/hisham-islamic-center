import { z } from 'zod';
import { getSurahByNumber } from '../constants/surahs.js';
import { QuranLessonType, TeacherAssessment } from '../types/enums.js';

const lessonCoreSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  date: z.coerce.date({ error: 'Date is required' }),
  type: z.enum([QuranLessonType.SABAQ, QuranLessonType.MURAJAAH]),
  surahNumber: z.coerce.number().int().min(1).max(114),
  fromAyah: z.coerce.number().int().min(1),
  toAyah: z.coerce.number().int().min(1),
  juz: z.coerce.number().int().min(1).max(30).optional(),
  pageFrom: z.coerce.number().int().min(1).optional(),
  pageTo: z.coerce.number().int().min(1).optional(),
  teacherAssessment: z.enum([
    TeacherAssessment.EXCELLENT,
    TeacherAssessment.GOOD,
    TeacherAssessment.NEEDS_IMPROVEMENT,
    TeacherAssessment.NEEDS_REVISION,
  ]),
  teacherNotes: z.string().trim().max(1000).optional(),
});

function refineAyahAndPages(data: z.infer<typeof lessonCoreSchema>, ctx: z.RefinementCtx): void {
  if (data.toAyah < data.fromAyah) {
    ctx.addIssue({ code: 'custom', message: 'To Ayah cannot be less than From Ayah', path: ['toAyah'] });
  }

  const surah = getSurahByNumber(data.surahNumber);
  if (!surah) {
    ctx.addIssue({ code: 'custom', message: 'Invalid Surah number', path: ['surahNumber'] });
    return;
  }

  if (data.fromAyah > surah.ayahCount || data.toAyah > surah.ayahCount) {
    ctx.addIssue({
      code: 'custom',
      message: `Ayah range must be within ${surah.name} (1–${surah.ayahCount})`,
      path: ['toAyah'],
    });
  }

  if (data.pageFrom !== undefined && data.pageTo !== undefined && data.pageTo < data.pageFrom) {
    ctx.addIssue({ code: 'custom', message: 'Page To cannot be less than Page From', path: ['pageTo'] });
  }
}

export const createQuranLessonSchema = lessonCoreSchema.superRefine(refineAyahAndPages);
export const updateQuranLessonSchema = lessonCoreSchema.superRefine(refineAyahAndPages);

export const listQuranLessonsQuerySchema = z.object({
  search: z.string().trim().optional(),
  type: z.enum([QuranLessonType.SABAQ, QuranLessonType.MURAJAAH]).optional(),
  studentId: z.string().trim().optional(),
  surahNumber: z.coerce.number().int().min(1).max(114).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export type CreateQuranLessonBody = z.infer<typeof createQuranLessonSchema>;
export type UpdateQuranLessonBody = z.infer<typeof updateQuranLessonSchema>;
