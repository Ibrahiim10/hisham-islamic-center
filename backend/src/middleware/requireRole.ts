import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError.js';
import type { UserRole } from '../types/enums.js';

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      next(new ApiError(401, 'Authentication required'));
      return;
    }

    if (!allowedRoles.includes(req.authUser.role)) {
      next(new ApiError(403, 'You do not have permission to access this resource'));
      return;
    }

    next();
  };
}
