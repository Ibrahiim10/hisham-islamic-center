import { env } from '../config/env.js';
import { UserModel } from '../models/User.model.js';
import { UserRole } from '../types/enums.js';
import { hashPassword } from '../utils/password.js';

export type EnsureDevelopmentAdminInput = {
  email: string;
  password: string;
  fullName: string;
  /** When true, re-hash and save password (and refresh name/role/active) for an existing admin. */
  resetPasswordIfExists: boolean;
};

export type EnsureDevelopmentAdminResult = {
  email: string;
  created: boolean;
  passwordUpdated: boolean;
  skippedExisting: boolean;
};

export function assertBootstrapAllowed(): void {
  if (env.NODE_ENV === 'production') {
    throw new Error('Admin bootstrap is not allowed when NODE_ENV=production.');
  }
}

/**
 * Creates a development admin with a bcrypt hash, or optionally resets password for an existing admin.
 * Idempotent when resetPasswordIfExists is false and the admin already exists.
 */
export async function ensureDevelopmentAdmin(
  input: EnsureDevelopmentAdminInput,
): Promise<EnsureDevelopmentAdminResult> {
  assertBootstrapAllowed();

  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();
  const passwordHash = await hashPassword(input.password);

  const existing = await UserModel.findOne({ email }).select('+passwordHash');

  if (!existing) {
    await UserModel.create({
      email,
      passwordHash,
      fullName,
      role: UserRole.ADMIN,
      isActive: true,
    });
    return { email, created: true, passwordUpdated: true, skippedExisting: false };
  }

  if (input.resetPasswordIfExists) {
    existing.passwordHash = passwordHash;
    existing.fullName = fullName;
    existing.role = UserRole.ADMIN;
    existing.isActive = true;
    await existing.save();
    return { email, created: false, passwordUpdated: true, skippedExisting: false };
  }

  return { email, created: false, passwordUpdated: false, skippedExisting: true };
}

export function resolveBootstrapAdminCredentials(): {
  email: string;
  password: string;
  fullName: string;
  resetPasswordIfExists: boolean;
} {
  const email =
    process.env.ADMIN_EMAIL?.trim() ||
    env.SEED_ADMIN_EMAIL ||
    'admin@hisham.local';
  const password =
    process.env.ADMIN_PASSWORD ||
    env.SEED_ADMIN_PASSWORD ||
    'ChangeMe123!';
  const fullName =
    process.env.ADMIN_FULL_NAME?.trim() ||
    env.SEED_ADMIN_FULL_NAME ||
    'Development Admin';
  const resetPasswordIfExists =
    env.SEED_ADMIN_RESET_PASSWORD === true || process.env.ADMIN_RESET_PASSWORD === 'true';

  return { email, password, fullName, resetPasswordIfExists };
}

/**
 * Credentials for explicit `npm run admin:bootstrap` (development only).
 * Prefer ADMIN_BOOTSTRAP_*; falls back to ADMIN_* / SEED_ADMIN_* from .env.
 */
export function resolveAdminBootstrapCredentials(): {
  email: string;
  password: string;
  fullName: string;
} {
  const email =
    process.env.ADMIN_BOOTSTRAP_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    env.SEED_ADMIN_EMAIL;
  const password =
    process.env.ADMIN_BOOTSTRAP_PASSWORD ||
    process.env.ADMIN_PASSWORD ||
    env.SEED_ADMIN_PASSWORD;
  const fullName =
    process.env.ADMIN_BOOTSTRAP_NAME?.trim() ||
    process.env.ADMIN_FULL_NAME?.trim() ||
    env.SEED_ADMIN_FULL_NAME;

  if (!email || !password || !fullName) {
    throw new Error(
      'Admin bootstrap requires ADMIN_BOOTSTRAP_EMAIL, ADMIN_BOOTSTRAP_PASSWORD, and ADMIN_BOOTSTRAP_NAME (or set SEED_ADMIN_* in backend/.env).',
    );
  }

  if (password.length < 8) {
    throw new Error('Admin bootstrap password must be at least 8 characters.');
  }

  return { email, password, fullName };
}
