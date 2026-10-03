/**
 * Development-only: create or update a single administrator (bcrypt password hash).
 *
 * Usage:
 *   ADMIN_BOOTSTRAP_EMAIL=admin@gmail.com \
 *   ADMIN_BOOTSTRAP_PASSWORD='...' \
 *   ADMIN_BOOTSTRAP_NAME='Hisham Administrator' \
 *   npm run admin:bootstrap -w backend
 *
 * Does NOT run on dev, build, start, or deploy.
 */
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import {
  ensureDevelopmentAdmin,
  resolveAdminBootstrapCredentials,
} from '../services/bootstrapAdmin.service.js';

function safeMongoDatabaseName(uri: string): string {
  try {
    const parsed = new URL(uri.replace(/^mongodb(\+srv)?:\/\//, 'http://'));
    const dbFromPath = parsed.pathname.replace(/^\//, '').split('?')[0];
    return dbFromPath || '(default db from URI)';
  } catch {
    return '(unknown)';
  }
}

async function main(): Promise<void> {
  const { email, password, fullName } = resolveAdminBootstrapCredentials();
  const database = safeMongoDatabaseName(env.MONGODB_URI);

  console.log(`Admin bootstrap target database: ${database}`);
  console.log(`Admin bootstrap email: ${email.trim().toLowerCase()}`);

  const result = await ensureDevelopmentAdmin({
    email,
    password,
    fullName,
    resetPasswordIfExists: true,
  });

  if (result.created) {
    console.log(`Created administrator: ${result.email}`);
  } else if (result.passwordUpdated) {
    console.log(`Updated administrator (profile, role, active, bcrypt hash): ${result.email}`);
  } else {
    console.log(`No changes applied for: ${result.email}`);
  }

  console.log('Password is stored as bcrypt only; credentials are not logged.');
}

connectDatabase()
  .then(() => main())
  .catch((error: unknown) => {
    console.error('Admin bootstrap failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
