import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { AttendanceModel } from '../models/Attendance.model.js';
import { ClassModel } from '../models/Class.model.js';
import { PaymentModel } from '../models/Payment.model.js';
import { StudentModel } from '../models/Student.model.js';
import { UserModel } from '../models/User.model.js';
import { syncAllModelIndexes } from '../models/index.js';
import { AttendanceStatus, Gender, PaymentMethod, StudentStatus, UserRole } from '../types/enums.js';
import { computeMonthlyFeeSummary } from '../services/feeCalculation.service.js';

describe('reports API', () => {
  let memoryServer: MongoMemoryServer;
  const app = createApp();
  const adminEmail = 'reports-admin@hisham.local';
  const adminPassword = 'SecureDevPass123!';
  let agent: ReturnType<typeof request.agent>;
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
      AttendanceModel.deleteMany({}),
      PaymentModel.deleteMany({}),
      StudentModel.deleteMany({}),
      UserModel.deleteMany({}),
      ClassModel.deleteMany({}),
    ]);

    await UserModel.create({
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      fullName: 'Reports Admin',
      role: UserRole.ADMIN,
      isActive: true,
    });

    agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: adminEmail, password: adminPassword }).expect(200);

    const tahfidh = await ClassModel.create({ name: 'Tahfidh', isActive: true });
    const student = await StudentModel.create({
      fullName: 'Report Student',
      dateOfBirth: new Date('2012-03-14'),
      gender: Gender.MALE,
      parentPhone: '+254711111111',
      address: 'Nairobi',
      classId: tahfidh._id,
      admissionDate: new Date('2024-01-01'),
      status: StudentStatus.ACTIVE,
    });
    studentId = student._id.toString();

    const adminUser = await UserModel.findOne({ email: adminEmail }).lean();
    await AttendanceModel.create({
      studentId: student._id,
      date: new Date('2026-10-01T10:00:00.000Z'),
      status: AttendanceStatus.PRESENT,
      recordedBy: adminUser!._id,
    });
    await PaymentModel.create({
      studentId: student._id,
      month: 10,
      year: 2026,
      amount: 8000,
      paymentMethod: PaymentMethod.MPESA,
      paymentDate: new Date('2026-10-05T10:00:00.000Z'),
      mpesaReference: 'QAA123456',
      recordedBy: adminUser!._id,
    });
  });

  it('requires authentication', async () => {
    await request(app).get('/api/reports/overview').expect(401);
  });

  it('returns overview aligned with fee summary for the month', async () => {
    const feeSummary = await computeMonthlyFeeSummary(10, 2026);
    const response = await agent.get('/api/reports/overview').query({ month: 10, year: 2026 }).expect(200);

    expect(response.body.data.fees.collected).toBe(feeSummary.totalCollected);
    expect(response.body.data.fees.expected).toBe(feeSummary.totalExpected);
    expect(response.body.data.attendance.present).toBe(1);
  });

  it('filters attendance report by student', async () => {
    const all = await agent
      .get('/api/reports/attendance')
      .query({ dateFrom: '2026-10-01', dateTo: '2026-10-31' })
      .expect(200);
    expect(all.body.data.summary.present).toBe(1);

    const filtered = await agent
      .get('/api/reports/attendance')
      .query({ dateFrom: '2026-10-01', dateTo: '2026-10-31', studentId })
      .expect(200);
    expect(filtered.body.data.items).toHaveLength(1);
    expect(filtered.body.data.items[0].studentName).toBe('Report Student');
  });

  it('returns student report with program filter', async () => {
    const response = await agent.get('/api/reports/students').query({ program: 'tahfidh' }).expect(200);
    expect(response.body.data.summary.active).toBe(1);
    expect(response.body.data.items[0].program).toBe('Tahfidh');
    expect(response.body.data.items[0].monthlyFee).toBe(8000);
  });

  it('matches fee report collected with fees summary', async () => {
    const feeSummary = await computeMonthlyFeeSummary(10, 2026);
    const response = await agent.get('/api/reports/fees').query({ month: 10, year: 2026 }).expect(200);
    expect(response.body.data.summary.collected).toBe(feeSummary.totalCollected);
    expect(response.body.data.payments.length).toBeGreaterThan(0);
  });
});
