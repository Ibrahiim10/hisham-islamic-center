import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/requireAuth.js';
import { loginAdmin } from '../services/auth.service.js';
import { clearAuthCookie, setAuthCookie } from '../utils/authCookie.js';
import { loginBodySchema } from '../validators/auth.validators.js';

export const authRouter = Router();

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

authRouter.post('/login', loginRateLimiter, async (req, res, next) => {
  try {
    const body = loginBodySchema.parse(req.body);
    const { token, user } = await loginAdmin(body);
    setAuthCookie(res, token);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, user: req.authUser });
});
