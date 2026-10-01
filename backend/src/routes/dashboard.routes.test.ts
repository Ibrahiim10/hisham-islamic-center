import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { AttendanceModel } from '../models/Attendance.model.js';
import { ClassModel } from '../models/Class.model.js';
import { FeeStructureModel } from '../models/FeeStructure.model.js';
import { PaymentModel } from '../models/Payment.model.js';
import { StudentModel } from '../models/Student.model.js';
import { UserModel } from '../models/User.model.js';
import { syncAllModelIndexes } from '../models/index.js';
import { AttendanceStatus, Gender, StudentStatus, UserRole } from '../types/enums.js';

describe('dashboard API', () => {
  let memoryServer: MongoMemoryServer;
  const app = createApp();
  const adminEmail = 'dashboard-admin@hisham.local';
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
    await Promise.all([
      StudentModel.deleteMany({}),
      PaymentModel.deleteMany({}),
      AttendanceModel.deleteMany({}),
      UserModel.deleteMany({}),
      ClassModel.deleteMany({}),
      FeeStructureModel.deleteMany({}),
    ]);

    const admin = await UserModel.create({
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      fullName: 'Dashboard Admin',
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await AttendanceModel.create({
      studentId: student._id,
      date: today,
      status: AttendanceStatus.PRESENT,
      recordedBy: admin._id,
    });

    const now = new Date();
    await PaymentModel.create({
      studentId: student._id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      amount: 5000,
      paymentDate: now,
      recordedBy: admin._id,
    });
  });

  async function loginAgent() {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: adminEmail, password: adminPassword }).expect(200);
    return agent;
  }

  it('returns real student, attendance, and fee metrics', async () => {
    const agent = await loginAgent();
    const now = new Date();
    const response = await agent
      .get('/api/dashboard/overview')
      .query({ month: now.getMonth() + 1, year: now.getFullYear() })
      .expect(200);

    expect(response.body.data.students.total).toBe(1);
    expect(response.body.data.students.tahfidh).toBe(1);
    expect(response.body.data.attendance.present).toBe(1);
    expect(response.body.data.fees.expected).toBe(8000);
    expect(response.body.data.fees.collected).toBe(5000);
    expect(response.body.data.fees.outstanding).toBe(3000);
    expect(response.body.data.fees.collectionRate).toBe(62.5);
  });

  it('requires authentication', async () => {
    await request(app).get('/api/dashboard/overview').expect(401);
  });
});
