import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { UserModel } from '../models/User.model.js';
import { syncAllModelIndexes } from '../models/index.js';
import { UserRole } from '../types/enums.js';

describe('admins API', () => {
  let memoryServer: MongoMemoryServer;
  const app = createApp();
  const adminEmail = 'primary-admin@hisham.local';
  const adminPassword = 'SecureDevPass123!';
  let agent: ReturnType<typeof request.agent>;
  let primaryAdminId: string;

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

    const primary = await UserModel.create({
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      fullName: 'Primary Admin',
      role: UserRole.ADMIN,
      isActive: true,
    });
    primaryAdminId = primary._id.toString();

    agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: adminEmail, password: adminPassword }).expect(200);
  });

  it('requires authentication', async () => {
    await request(app).get('/api/admins').expect(401);
  });

  it('lists administrators', async () => {
    const response = await agent.get('/api/admins').expect(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].email).toBe(adminEmail);
    expect(response.body.data[0].passwordHash).toBeUndefined();
  });

  it('creates, updates, changes password, and deletes an admin', async () => {
    const created = await agent
      .post('/api/admins')
      .send({
        fullName: 'Secondary Admin',
        email: 'secondary@hisham.local',
        password: 'AnotherPass1',
        confirmPassword: 'AnotherPass1',
        role: UserRole.ADMIN,
        isActive: true,
      })
      .expect(201);

    const secondaryId = created.body.data.id as string;

    await agent
      .patch(`/api/admins/${secondaryId}`)
      .send({
        fullName: 'Secondary Admin Updated',
        email: 'secondary@hisham.local',
        role: UserRole.ADMIN,
        isActive: true,
      })
      .expect(200);

    const secondaryAgent = request.agent(app);
    await secondaryAgent
      .post('/api/auth/login')
      .send({ email: 'secondary@hisham.local', password: 'AnotherPass1' })
      .expect(200);

    await agent
      .post(`/api/admins/${secondaryId}/change-password`)
      .send({
        currentPassword: adminPassword,
        newPassword: 'ResetPass456',
        confirmPassword: 'ResetPass456',
      })
      .expect(200);

    await secondaryAgent
      .post('/api/auth/login')
      .send({ email: 'secondary@hisham.local', password: 'ResetPass456' })
      .expect(200);

    await agent.delete(`/api/admins/${secondaryId}`).expect(200);
    expect(await UserModel.countDocuments()).toBe(1);
  });

  it('prevents deleting self and last active admin', async () => {
    await agent.delete(`/api/admins/${primaryAdminId}`).expect(400);

    const created = await agent.post('/api/admins').send({
      fullName: 'Only Other',
      email: 'only-other@hisham.local',
      password: 'AnotherPass1',
      confirmPassword: 'AnotherPass1',
      role: UserRole.ADMIN,
      isActive: true,
    });

    await agent.delete(`/api/admins/${created.body.data.id}`).expect(200);
    await agent.delete(`/api/admins/${primaryAdminId}`).expect(400);
  });
});
