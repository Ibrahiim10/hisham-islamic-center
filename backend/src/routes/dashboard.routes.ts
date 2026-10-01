import { Router } from 'express';
import { getDashboardOverview } from '../services/dashboard.service.js';
import { dashboardOverviewQuerySchema } from '../validators/dashboard.validators.js';

export const dashboardRouter = Router();

dashboardRouter.get('/overview', async (req, res, next) => {
  try {
    const query = dashboardOverviewQuerySchema.parse(req.query);
    const data = await getDashboardOverview(query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});
