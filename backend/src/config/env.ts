import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(5000),
    CLIENT_URL: z.string().url().optional(),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    JWT_SECRET: z.string().min(16).optional(),
    JWT_EXPIRES_IN: z.string().min(2).default('7d'),
    AUTH_COOKIE_NAME: z.string().min(1).default('hisham_auth'),
    SEED_ADMIN_EMAIL: z.string().email().optional(),
    SEED_ADMIN_PASSWORD: z.string().min(8).optional(),
    SEED_ADMIN_FULL_NAME: z.string().min(1).optional(),
    SEED_ADMIN_RESET_PASSWORD: z
      .enum(['true', 'false'])
      .optional()
      .transform((value) => value === 'true'),
    SEED_CLEAR: z
      .enum(['true', 'false'])
      .optional()
      .transform((value) => value === 'true'),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === 'production' && !data.JWT_SECRET) {
      ctx.addIssue({
        code: 'custom',
        message: 'JWT_SECRET is required in production',
        path: ['JWT_SECRET'],
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

function resolveClientUrl(clientUrl: string | undefined): string {
  if (clientUrl) {
    return clientUrl;
  }
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }
  return 'http://localhost:5173';
}

export const env = {
  ...parsed.data,
  CLIENT_URL: resolveClientUrl(parsed.data.CLIENT_URL),
};

export type Env = typeof env;
