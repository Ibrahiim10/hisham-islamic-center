/**
 * Safe development diagnostic — no secrets printed.
 * Usage: npm run diagnose:admin -w backend
 */
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { UserModel } from '../models/User.model.js';
import { UserRole } from '../types/enums.js';
import { verifyPassword } from '../utils/password.js';

const TARGET_EMAIL = (process.env.DIAGNOSE_ADMIN_EMAIL ?? 'admin@hisham.local').trim().toLowerCase();

function safeMongoTarget(uri: string): { host: string; database: string } {
  try {
    const parsed = new URL(uri.replace(/^mongodb(\+srv)?:\/\//, 'http://'));
    const dbFromPath = parsed.pathname.replace(/^\//, '').split('?')[0];
    return {
      host: parsed.host || '(unknown host)',
      database: dbFromPath || '(default db from URI)',
    };
  } catch {
    return { host: '(could not parse URI)', database: '(unknown)' };
  }
}

function hashDiagnostics(passwordHash: string | undefined | null): {
  present: boolean;
  prefix: string;
  length: number;
  looksBcrypt: boolean;
  looksPlaintext: boolean;
} {
  if (!passwordHash) {
    return { present: false, prefix: '', length: 0, looksBcrypt: false, looksPlaintext: false };
  }
  const looksBcrypt = /^\$2[aby]\$/.test(passwordHash);
  return {
    present: true,
    prefix: passwordHash.slice(0, 7),
    length: passwordHash.length,
    looksBcrypt,
    looksPlaintext: !looksBcrypt && passwordHash.length < 80,
  };
}

async function main(): Promise<void> {
  const target = safeMongoTarget(env.MONGODB_URI);

  console.log('--- Hisham dev admin diagnostic (safe output) ---');
  console.log(`NODE_ENV: ${env.NODE_ENV}`);
  console.log(`MongoDB host: ${target.host}`);
  console.log(`MongoDB database name: ${target.database}`);
  console.log(`Mongoose collection: ${UserModel.collection.name}`);
  console.log(`Expected UserRole.ADMIN: "${UserRole.ADMIN}"`);
  console.log(`Lookup email (normalized): ${TARGET_EMAIL}`);
  console.log(`SEED_ADMIN_EMAIL configured: ${Boolean(env.SEED_ADMIN_EMAIL)}`);
  console.log(`SEED_ADMIN_PASSWORD configured: ${Boolean(env.SEED_ADMIN_PASSWORD)}`);
  console.log(`SEED_ADMIN_RESET_PASSWORD: ${String(env.SEED_ADMIN_RESET_PASSWORD === true)}`);

  await connectDatabase();

  const connDb = mongoose.connection.db?.databaseName ?? '(unknown)';
  console.log(`Active connection database name: ${connDb}`);

  const user = await UserModel.findOne({ email: TARGET_EMAIL }).select('+passwordHash');
  console.log(`User found: ${Boolean(user)}`);

  if (!user) {
    const count = await UserModel.countDocuments({ role: UserRole.ADMIN });
    console.log(`Admin-role users in this database: ${count}`);
    console.log('Hint: Compass may be connected to a different database name than MONGODB_URI.');
    return;
  }

  console.log(`User email (stored): ${user.email}`);
  console.log(`isActive: ${user.isActive}`);
  console.log(`role (stored): "${user.role}"`);
  console.log(`role matches UserRole.ADMIN: ${user.role === UserRole.ADMIN}`);

  const hash = hashDiagnostics(user.passwordHash);
  console.log(`passwordHash present: ${hash.present}`);
  console.log(`passwordHash length: ${hash.length}`);
  console.log(`passwordHash prefix (first 7 chars only): ${hash.prefix || '(empty)'}`);
  console.log(`passwordHash looks like bcrypt: ${hash.looksBcrypt}`);
  console.log(`passwordHash looks like plaintext: ${hash.looksPlaintext}`);

  if (hash.looksBcrypt && env.SEED_ADMIN_PASSWORD) {
    const matchesSeed = await verifyPassword(env.SEED_ADMIN_PASSWORD, user.passwordHash);
    console.log(`Login would succeed with SEED_ADMIN_PASSWORD from .env: ${matchesSeed}`);
  } else if (!env.SEED_ADMIN_PASSWORD) {
    console.log('SEED_ADMIN_PASSWORD not set — cannot test against .env password without printing it.');
  }

  if (hash.looksBcrypt) {
    const matchesAdmin123 = await verifyPassword('Admin123', user.passwordHash);
    console.log(`Login with Postman password "Admin123" would succeed: ${matchesAdmin123}`);
  } else if (hash.looksPlaintext) {
    console.log('passwordHash is NOT bcrypt — bcrypt.compare will always fail until you run bootstrap:admin with SEED_ADMIN_RESET_PASSWORD=true');
  }
}

main()
  .catch((error: unknown) => {
    console.error('Diagnostic failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
