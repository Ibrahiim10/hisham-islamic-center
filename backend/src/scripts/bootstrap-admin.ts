/**
 * Development-only: create or reset the bootstrap administrator password hash (bcrypt).
 *
 * Usage:
 *   npm run bootstrap:admin -w backend
 *
 * Reset an existing admin's password (e.g. after a manual Compass edit):
 *   SEED_ADMIN_RESET_PASSWORD=true npm run bootstrap:admin -w backend
 */
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import {
  ensureDevelopmentAdmin,
  resolveBootstrapAdminCredentials,
} from '../services/bootstrapAdmin.service.js';

async function main(): Promise<void> {
  const { email, password, fullName, resetPasswordIfExists } = resolveBootstrapAdminCredentials();

  if (!env.SEED_ADMIN_EMAIL && !process.env.ADMIN_EMAIL) {
    console.warn('Using default bootstrap email admin@hisham.local — set SEED_ADMIN_EMAIL or ADMIN_EMAIL in backend/.env');
  }
  if (!env.SEED_ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD) {
    console.warn(
      'Using default bootstrap password from env defaults — set SEED_ADMIN_PASSWORD or ADMIN_PASSWORD in backend/.env',
    );
  }

  const result = await ensureDevelopmentAdmin({
    email,
    password,
    fullName,
    resetPasswordIfExists,
  });

  if (result.created) {
    console.log(`Created development admin: ${result.email}`);
  } else if (result.passwordUpdated) {
    console.log(`Reset bcrypt password hash for: ${result.email}`);
  } else {
    console.log(
      `Admin already exists (${result.email}). Password was NOT changed. Set SEED_ADMIN_RESET_PASSWORD=true to re-hash the password.`,
    );
  }

  console.log('Login with the password from SEED_ADMIN_PASSWORD / ADMIN_PASSWORD in your local .env (not printed here).');
}

connectDatabase()
  .then(() => main())
  .catch((error: unknown) => {
    console.error('Bootstrap admin failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
