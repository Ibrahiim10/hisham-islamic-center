import type { Request, Response } from 'express';
import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { dashboardRouter } from './dashboard.routes.js';
import { feesRouter } from './fees.routes.js';
import { quranRouter } from './quran.routes.js';
import { reportsRouter } from './reports.routes.js';
import { studentsRouter } from './students.routes.js';
import { UserRole } from '../types/enums.js';

function notImplementedYet(_req: Request, res: Response): void {
  res.status(501).json({
    success: false,
    message: 'This API is not available yet.',
  });
}

export const protectedApiRouter = Router();

protectedApiRouter.use(requireAuth);
protectedApiRouter.use(requireRole(UserRole.ADMIN));

protectedApiRouter.use('/students', studentsRouter);
protectedApiRouter.use('/dashboard', dashboardRouter);
protectedApiRouter.use('/fees', feesRouter);
protectedApiRouter.use('/quran', quranRouter);
protectedApiRouter.use('/reports', reportsRouter);

const protectedResources = [
  '/attendance',
  '/notifications',
  '/settings',
] as const;

for (const path of protectedResources) {
  protectedApiRouter.use(path, notImplementedYet);
}
