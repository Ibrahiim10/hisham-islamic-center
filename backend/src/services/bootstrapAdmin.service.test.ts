import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { UserModel } from '../models/User.model.js';
import { syncAllModelIndexes } from '../models/index.js';
import { UserRole } from '../types/enums.js';
import { verifyPassword } from '../utils/password.js';
import { ensureDevelopmentAdmin, resolveAdminBootstrapCredentials } from './bootstrapAdmin.service.js';
import { createAdmin } from './admin.service.js';

describe('bootstrapAdmin.service', () => {
  let memoryServer: MongoMemoryServer;

  beforeAll(async () => {
    memoryServer = await MongoMemoryServer.create();
    await connectDatabase(memoryServer.getUri());
    await syncAllModelIndexes();
  }, 120_000);

  afterAll(async () => {
    await disconnectDatabase();
    await memoryServer.stop();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it('stores bcrypt hash when creating development admin', async () => {
    const result = await ensureDevelopmentAdmin({
      email: 'bootstrap@hisham.local',
      password: 'SecureDevPass123!',
      fullName: 'Bootstrap Admin',
      resetPasswordIfExists: false,
    });

    expect(result.created).toBe(true);
    const doc = await UserModel.findOne({ email: 'bootstrap@hisham.local' }).select('+passwordHash');
    expect(doc?.passwordHash).toMatch(/^\$2[ab]\$/);
    expect(await verifyPassword('SecureDevPass123!', doc!.passwordHash)).toBe(true);
    expect(doc?.role).toBe(UserRole.ADMIN);
  });

  it('does not change password when admin exists and reset is false', async () => {
    await ensureDevelopmentAdmin({
      email: 'existing@hisham.local',
      password: 'FirstPass123!',
      fullName: 'First',
      resetPasswordIfExists: false,
    });

    const skipped = await ensureDevelopmentAdmin({
      email: 'existing@hisham.local',
      password: 'SecondPass123!',
      fullName: 'Second',
      resetPasswordIfExists: false,
    });

    expect(skipped.skippedExisting).toBe(true);
    const doc = await UserModel.findOne({ email: 'existing@hisham.local' }).select('+passwordHash');
    expect(await verifyPassword('FirstPass123!', doc!.passwordHash)).toBe(true);
    expect(await verifyPassword('SecondPass123!', doc!.passwordHash)).toBe(false);
  });

  it('resolveAdminBootstrapCredentials reads ADMIN_BOOTSTRAP_* env vars', () => {
    const prev = {
      email: process.env.ADMIN_BOOTSTRAP_EMAIL,
      password: process.env.ADMIN_BOOTSTRAP_PASSWORD,
      name: process.env.ADMIN_BOOTSTRAP_NAME,
    };
    process.env.ADMIN_BOOTSTRAP_EMAIL = 'bootstrap-env@hisham.local';
    process.env.ADMIN_BOOTSTRAP_PASSWORD = 'EnvPass123!';
    process.env.ADMIN_BOOTSTRAP_NAME = 'Env Bootstrap Admin';
    try {
      const creds = resolveAdminBootstrapCredentials();
      expect(creds.email).toBe('bootstrap-env@hisham.local');
      expect(creds.fullName).toBe('Env Bootstrap Admin');
    } finally {
      if (prev.email === undefined) delete process.env.ADMIN_BOOTSTRAP_EMAIL;
      else process.env.ADMIN_BOOTSTRAP_EMAIL = prev.email;
      if (prev.password === undefined) delete process.env.ADMIN_BOOTSTRAP_PASSWORD;
      else process.env.ADMIN_BOOTSTRAP_PASSWORD = prev.password;
      if (prev.name === undefined) delete process.env.ADMIN_BOOTSTRAP_NAME;
      else process.env.ADMIN_BOOTSTRAP_NAME = prev.name;
    }
  });

  it('updates password hash when reset is requested', async () => {
    await UserModel.create({
      email: 'broken@hisham.local',
      passwordHash: 'Admin123',
      fullName: 'Broken',
      role: UserRole.ADMIN,
      isActive: true,
    });

    const updated = await ensureDevelopmentAdmin({
      email: 'broken@hisham.local',
      password: 'FixedPass123!',
      fullName: 'Fixed Admin',
      resetPasswordIfExists: true,
    });

    expect(updated.passwordUpdated).toBe(true);
    const doc = await UserModel.findOne({ email: 'broken@hisham.local' }).select('+passwordHash');
    expect(doc?.passwordHash).toMatch(/^\$2[ab]\$/);
    expect(await verifyPassword('FixedPass123!', doc!.passwordHash)).toBe(true);
  });
});

describe('admin.service password hashing', () => {
  let memoryServer: MongoMemoryServer;

  beforeAll(async () => {
    memoryServer = await MongoMemoryServer.create();
    await connectDatabase(memoryServer.getUri());
    await syncAllModelIndexes();
  }, 120_000);

  afterAll(async () => {
    await disconnectDatabase();
    await memoryServer.stop();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it('hashes password on createAdmin and omits hash from public user', async () => {
    const publicUser = await createAdmin({
      fullName: 'API Admin',
      email: 'api-admin@hisham.local',
      password: 'AnotherPass1',
      confirmPassword: 'AnotherPass1',
      role: UserRole.ADMIN,
      isActive: true,
    });

    expect((publicUser as { passwordHash?: string }).passwordHash).toBeUndefined();

    const doc = await UserModel.findOne({ email: 'api-admin@hisham.local' }).select('+passwordHash');
    expect(doc?.passwordHash).toMatch(/^\$2[ab]\$/);
    expect(await verifyPassword('AnotherPass1', doc!.passwordHash)).toBe(true);
  });
});
