import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { ClassModel } from '../models/Class.model.js';
import { FeeStructureModel } from '../models/FeeStructure.model.js';
import { PaymentModel } from '../models/Payment.model.js';
import { StudentModel } from '../models/Student.model.js';
import { UserModel } from '../models/User.model.js';
import { syncAllModelIndexes } from '../models/index.js';
import { Gender, StudentStatus, UserRole } from '../types/enums.js';

describe('fees API', () => {
  let memoryServer: MongoMemoryServer;
  const app = createApp();
  const adminEmail = 'fees-admin@hisham.local';
  const adminPassword = 'SecureDevPass123!';
  let studentId: string;

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
    await Promise.all([
      PaymentModel.deleteMany({}),
      StudentModel.deleteMany({}),
      UserModel.deleteMany({}),
      ClassModel.deleteMany({}),
      FeeStructureModel.deleteMany({}),
    ]);

    await UserModel.create({
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      fullName: 'Fees Admin',
      role: UserRole.ADMIN,
      isActive: true,
    });

    const tahfidh = await ClassModel.create({ name: 'Tahfidh', isActive: true });
    await FeeStructureModel.create({
      classId: tahfidh._id,
      amount: 8000,
      currency: 'KES',
      effectiveFrom: new Date('2024-01-01'),
      isActive: true,
    });

    const student = await StudentModel.create({
      fullName: 'Ahmed Hassan',
      dateOfBirth: new Date('2012-03-14'),
      gender: Gender.MALE,
      parentPhone: '+254711111111',
      address: 'Nairobi',
      classId: tahfidh._id,
      studentType: 'regular',
      admissionDate: new Date('2024-01-01'),
      status: StudentStatus.ACTIVE,
    });
    studentId = student._id.toString();
  });

  async function loginAgent() {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: adminEmail, password: adminPassword }).expect(200);
    return agent;
  }

  it('returns fee summary for the selected month', async () => {
    const agent = await loginAgent();
    const now = new Date();
    const response = await agent
      .get('/api/fees/summary')
      .query({ month: now.getMonth() + 1, year: now.getFullYear() })
      .expect(200);

    expect(response.body.data.totalExpected).toBe(8000);
    expect(response.body.data.totalCollected).toBe(0);
    expect(response.body.data.totalOutstanding).toBe(8000);
    expect(response.body.data.studentsUnpaid).toBe(1);
  });

  it('records an M-Pesa payment and updates summary', async () => {
    const agent = await loginAgent();
    const now = new Date();

    await agent
      .post('/api/fees/payments')
      .send({
        studentId,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        amount: 5000,
        mpesaReference: 'QHX1234567',
        paymentDate: now.toISOString(),
      })
      .expect(201);

    const summary = await agent
      .get('/api/fees/summary')
      .query({ month: now.getMonth() + 1, year: now.getFullYear() })
      .expect(200);

    expect(summary.body.data.totalCollected).toBe(5000);
    expect(summary.body.data.totalOutstanding).toBe(3000);
    expect(summary.body.data.studentsPartial).toBe(1);
  });

  it('rejects duplicate M-Pesa references', async () => {
    const agent = await loginAgent();
    const now = new Date();
    const payload = {
      studentId,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      amount: 1000,
      mpesaReference: 'DUPLICATE123',
      paymentDate: now.toISOString(),
    };

    await agent.post('/api/fees/payments').send(payload).expect(201);
    await agent.post('/api/fees/payments').send({ ...payload, amount: 2000 }).expect(409);
  });

  it('returns student fee account details', async () => {
    const agent = await loginAgent();
    const now = new Date();
    const response = await agent
      .get(`/api/fees/student/${studentId}`)
      .query({ month: now.getMonth() + 1, year: now.getFullYear() })
      .expect(200);

    expect(response.body.data.account.monthlyFee).toBe(8000);
    expect(response.body.data.account.status).toBe('unpaid');
  });
});
