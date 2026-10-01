import { Router } from 'express';
import { getDatabaseState } from '../config/database.js';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  const database = getDatabaseState();
  res.json({
    success: true,
    service: 'hisham-islamic-center-api',
    phase: 3,
    database,
    timestamp: new Date().toISOString(),
  });
});
