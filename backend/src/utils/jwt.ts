import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { UserRole } from '../types/enums.js';

export type AuthTokenPayload = {
  sub: string;
  role: UserRole;
};

function getJwtSecret(): string {
  if (env.JWT_SECRET) {
    return env.JWT_SECRET;
  }
  if (env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }
  return 'development-only-jwt-secret-min-16-chars';
}

export function signAuthToken(payload: AuthTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, getJwtSecret(), options);
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, getJwtSecret());
  if (typeof decoded !== 'object' || decoded === null || !('sub' in decoded) || !('role' in decoded)) {
    throw new jwt.JsonWebTokenError('Invalid token payload');
  }
  return {
    sub: String(decoded.sub),
    role: decoded.role as UserRole,
  };
}
