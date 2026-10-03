import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { syncAllModelIndexes } from '../models/index.js';
import { UserModel } from '../models/User.model.js';
import { UserRole } from '../types/enums.js';

describe('auth API', () => {
  let memoryServer: MongoMemoryServer;
  const app = createApp();
  const adminEmail = 'phase3-admin@hisham.local';
  const adminPassword = 'SecureDevPass123!';

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
    await UserModel.create({
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      fullName: 'Phase 3 Admin',
      role: UserRole.ADMIN,
      isActive: true,
    });
  });

  it('logs in with valid credentials and sets auth cookie', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: adminEmail, password: adminPassword })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(adminEmail);
    expect(response.body.user.passwordHash).toBeUndefined();
    const setCookieHeader = response.headers['set-cookie'];
    const setCookieValues = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : setCookieHeader
        ? [setCookieHeader]
        : [];
    expect(setCookieValues.some((value) => value.includes(env.AUTH_COOKIE_NAME))).toBe(true);
  });

  it('stores bcrypt hash for seeded admin document', async () => {
    const doc = await UserModel.findOne({ email: adminEmail }).select('+passwordHash');
    expect(doc?.passwordHash).toMatch(/^\$2[ab]\$/);
    expect(doc?.passwordHash).not.toBe(adminPassword);
  });

  it('rejects invalid password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: adminEmail, password: 'wrong-password' })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('rejects unknown email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'missing@hisham.local', password: adminPassword })
      .expect(401);

    expect(response.body.message).toBe('Invalid email or password');
  });

  it('rejects inactive admin', async () => {
    await UserModel.updateOne({ email: adminEmail }, { isActive: false });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: adminEmail, password: adminPassword })
      .expect(403);

    expect(response.body.success).toBe(false);
  });

  it('returns current user from /me when authenticated', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: adminEmail, password: adminPassword }).expect(200);

    const me = await agent.get('/api/auth/me').expect(200);
    expect(me.body.user.fullName).toBe('Phase 3 Admin');
  });

  it('blocks /me when logged out', async () => {
    const response = await request(app).get('/api/auth/me').expect(401);
    expect(response.body.success).toBe(false);
  });

  it('clears session on logout', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: adminEmail, password: adminPassword }).expect(200);
    await agent.post('/api/auth/logout').expect(200);
    await agent.get('/api/auth/me').expect(401);
  });

  it('protects application resources when logged out', async () => {
    await request(app).get('/api/students').expect(401);
  });

  it('allows protected student list when logged in as admin', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: adminEmail, password: adminPassword }).expect(200);
    await agent.get('/api/students').expect(200);
  });

  it('keeps health check public', async () => {
    const response = await request(app).get('/api/health').expect(200);
    expect(response.body.success).toBe(true);
  });
});
