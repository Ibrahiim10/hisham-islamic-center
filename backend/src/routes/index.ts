import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { healthRouter } from './health.routes.js';
import { protectedApiRouter } from './protected.routes.js';
import { publicRouter } from './public.routes.js';

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use('/public', publicRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use(protectedApiRouter);
