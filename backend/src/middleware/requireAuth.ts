import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getAuthCookieName } from '../utils/authCookie.js';
import { verifyAuthToken } from '../utils/jwt.js';
import { ApiError } from '../utils/apiError.js';
import { getAuthenticatedUser } from '../services/auth.service.js';

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.[getAuthCookieName()] as string | undefined;
    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const payload = verifyAuthToken(token);
    req.authUser = await getAuthenticatedUser(payload.sub);
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      next(new ApiError(401, 'Authentication required'));
      return;
    }
    next(error);
  }
}
