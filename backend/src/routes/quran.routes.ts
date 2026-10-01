import { Router } from 'express';
import {
  createQuranLesson,
  deleteQuranLesson,
  getQuranLessonById,
  getQuranModuleStats,
  getStudentQuranSummary,
  listQuranLessons,
  listSurahs,
  updateQuranLesson,
} from '../services/quranLesson.service.js';
import {
  createQuranLessonSchema,
  listQuranLessonsQuerySchema,
  updateQuranLessonSchema,
} from '../validators/quran.validators.js';

export const quranRouter = Router();

quranRouter.get('/surahs', (_req, res) => {
  res.json({ success: true, data: listSurahs() });
});

quranRouter.get('/stats', async (_req, res, next) => {
  try {
    const data = await getQuranModuleStats();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

quranRouter.get('/records', async (req, res, next) => {
  try {
    const query = listQuranLessonsQuerySchema.parse(req.query);
    const data = await listQuranLessons({
      search: query.search,
      type: query.type,
      studentId: query.studentId,
      surahNumber: query.surahNumber,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      page: query.page,
      limit: query.limit,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

quranRouter.get('/records/:id', async (req, res, next) => {
  try {
    const data = await getQuranLessonById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

quranRouter.get('/students/:studentId', async (req, res, next) => {
  try {
    const data = await getStudentQuranSummary(req.params.studentId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

quranRouter.post('/records', async (req, res, next) => {
  try {
    if (!req.authUser) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    const body = createQuranLessonSchema.parse(req.body);
    const data = await createQuranLesson(body, req.authUser.id);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

quranRouter.put('/records/:id', async (req, res, next) => {
  try {
    const body = updateQuranLessonSchema.parse(req.body);
    const data = await updateQuranLesson(req.params.id, body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

quranRouter.delete('/records/:id', async (req, res, next) => {
  try {
    await deleteQuranLesson(req.params.id);
    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    next(error);
  }
});
