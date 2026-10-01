import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { ClassModel } from '../models/Class.model.js';
import { FeeStructureModel } from '../models/FeeStructure.model.js';
import { StudentModel } from '../models/Student.model.js';
import { UserModel } from '../models/User.model.js';
import { syncAllModelIndexes } from '../models/index.js';
import { Gender, StudentStatus, UserRole } from '../types/enums.js';

describe('students API', () => {
  let memoryServer: MongoMemoryServer;
  const app = createApp();
  const adminEmail = 'students-admin@hisham.local';
  const adminPassword = 'SecureDevPass123!';
  let tahfidhClassId: string;

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
    await Promise.all([StudentModel.deleteMany({}), UserModel.deleteMany({}), ClassModel.deleteMany({})]);

    await UserModel.create({
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      fullName: 'Students Admin',
      role: UserRole.ADMIN,
      isActive: true,
    });

    const tahfidh = await ClassModel.create({ name: 'Tahfidh', isActive: true });
    tahfidhClassId = tahfidh._id.toString();
    await FeeStructureModel.create({
      classId: tahfidh._id,
      amount: 8000,
      currency: 'KES',
      effectiveFrom: new Date('2024-01-01'),
      isActive: true,
    });

    await StudentModel.create({
      fullName: 'Ahmed Hassan',
      dateOfBirth: new Date('2012-03-14'),
      gender: Gender.MALE,
      parentPhone: '+254711111111',
      address: 'Nairobi',
      classId: tahfidh._id,
      studentType: 'regular',
      admissionDate: new Date('2024-01-01'),
      status: StudentStatus.ACTIVE,
      admissionNumber: 'HIC-2024-0001',
    });
    await StudentModel.create({
      fullName: 'Mohamed Ahmed',
      dateOfBirth: new Date('2011-01-01'),
      gender: Gender.MALE,
      parentPhone: '+254722222222',
      address: 'Mombasa',
      classId: tahfidh._id,
      studentType: 'regular',
      admissionDate: new Date('2024-01-01'),
      status: StudentStatus.ACTIVE,
    });
  });

  async function loginAgent() {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: adminEmail, password: adminPassword }).expect(200);
    return agent;
  }

  it('searches students by partial name case-insensitively', async () => {
    const agent = await loginAgent();
    const response = await agent.get('/api/students').query({ search: 'ahm' }).expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.items.length).toBe(2);
    expect(response.body.data.items.map((item: { fullName: string }) => item.fullName)).toEqual(
      expect.arrayContaining(['Ahmed Hassan', 'Mohamed Ahmed']),
    );
  });

  it('creates a student with generated admission number and monthly fee', async () => {
    const agent = await loginAgent();
    const response = await agent
      .post('/api/students')
      .send({
        fullName: 'Fatima Ali',
        dateOfBirth: '2010-05-05',
        gender: Gender.FEMALE,
        parentPhone: '+254733333333',
        address: 'Kisumu Road',
        classId: tahfidhClassId,
      })
      .expect(201);

    expect(response.body.data.admissionNumber).toMatch(/^HIC-\d{4}-\d{4}$/);
    expect(response.body.data.monthlyFee).toBe(8000);

    const stored = await StudentModel.findById(response.body.data.id);
    expect(stored?.fullName).toBe('Fatima Ali');
  });

  it('updates an existing student without creating duplicates', async () => {
    const agent = await loginAgent();
    const list = await agent.get('/api/students').query({ search: 'Ahmed Hassan' }).expect(200);
    const studentId = list.body.data.items[0].id as string;

    await agent
      .put(`/api/students/${studentId}`)
      .send({
        fullName: 'Ahmed Hassan Updated',
        dateOfBirth: '2012-03-14',
        gender: Gender.MALE,
        parentPhone: '+254799999999',
        address: 'Updated Address',
        classId: tahfidhClassId,
      })
      .expect(200);

    expect(await StudentModel.countDocuments()).toBe(2);
    const updated = await StudentModel.findById(studentId);
    expect(updated?.fullName).toBe('Ahmed Hassan Updated');
    expect(updated?.parentPhone).toBe('+254799999999');
  });

  it('returns student profile by id', async () => {
    const agent = await loginAgent();
    const student = await StudentModel.findOne({ fullName: 'Ahmed Hassan' });
    const response = await agent.get(`/api/students/${student?._id.toString()}`).expect(200);

    expect(response.body.data.fullName).toBe('Ahmed Hassan');
    expect(response.body.data.className).toBe('Tahfidh');
  });

  it('rejects unauthenticated access', async () => {
    await request(app).get('/api/students').expect(401);
  });
});
