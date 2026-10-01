import { Router } from 'express';
import {
  getAttendanceReport,
  getFeeReport,
  getQuranReport,
  getReportsOverview,
  getStudentReport,
} from '../services/reports.service.js';
import {
  reportAttendanceQuerySchema,
  reportFeesQuerySchema,
  reportOverviewQuerySchema,
  reportQuranQuerySchema,
  reportStudentsQuerySchema,
} from '../validators/reports.validators.js';

export const reportsRouter = Router();

reportsRouter.get('/overview', async (req, res, next) => {
  try {
    const query = reportOverviewQuerySchema.parse(req.query);
    const data = await getReportsOverview(query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

reportsRouter.get('/students', async (req, res, next) => {
  try {
    const query = reportStudentsQuerySchema.parse(req.query);
    const data = await getStudentReport(query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

reportsRouter.get('/attendance', async (req, res, next) => {
  try {
    const query = reportAttendanceQuerySchema.parse(req.query);
    const data = await getAttendanceReport(query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

reportsRouter.get('/fees', async (req, res, next) => {
  try {
    const query = reportFeesQuerySchema.parse(req.query);
    const data = await getFeeReport(query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

reportsRouter.get('/quran', async (req, res, next) => {
  try {
    const query = reportQuranQuerySchema.parse(req.query);
    const data = await getQuranReport(query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});
