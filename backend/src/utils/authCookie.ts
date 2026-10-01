import type { CookieOptions, Response } from 'express';
import { env } from '../config/env.js';

export function getAuthCookieName(): string {
  return env.AUTH_COOKIE_NAME;
}

function expiresInToMilliseconds(expiresIn: string): number {
  const trimmed = expiresIn.trim();
  const match = /^(\d+)([smhd])$/i.exec(trimmed);
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }
  const amount = Number(match[1]);
  const unit = match[2]?.toLowerCase();
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return amount * (multipliers[unit ?? 'd'] ?? multipliers.d);
}

export function getAuthCookieOptions(): CookieOptions {
  const isProduction = env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: expiresInToMilliseconds(env.JWT_EXPIRES_IN),
  };
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(getAuthCookieName(), token, getAuthCookieOptions());
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(getAuthCookieName(), {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}
