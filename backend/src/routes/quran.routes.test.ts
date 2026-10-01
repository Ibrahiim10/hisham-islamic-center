import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { ClassModel } from '../models/Class.model.js';
import { QuranLessonRecordModel } from '../models/QuranLessonRecord.model.js';
import { StudentModel } from '../models/Student.model.js';
import { UserModel } from '../models/User.model.js';
import { syncAllModelIndexes } from '../models/index.js';
import { Gender, QuranLessonType, StudentStatus, TeacherAssessment, UserRole } from '../types/enums.js';

describe('quran API', () => {
  let memoryServer: MongoMemoryServer;
  const app = createApp();
  const adminEmail = 'quran-admin@hisham.local';
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
    await Promise.all([QuranLessonRecordModel.deleteMany({}), StudentModel.deleteMany({}), UserModel.deleteMany({}), ClassModel.deleteMany({})]);

    await UserModel.create({
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      fullName: 'Quran Admin',
      role: UserRole.ADMIN,
      isActive: true,
    });

    const tahfidh = await ClassModel.create({ name: 'Tahfidh', isActive: true });
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

  it('creates Sabaq and Murajaah records', async () => {
    const agent = await loginAgent();
    const date = new Date('2026-10-01T12:00:00.000Z').toISOString();

    await agent
      .post('/api/quran/records')
      .send({
        studentId,
        date,
        type: QuranLessonType.SABAQ,
        surahNumber: 2,
        fromAyah: 1,
        toAyah: 5,
        juz: 1,
        pageFrom: 2,
        pageTo: 3,
        teacherAssessment: TeacherAssessment.GOOD,
        teacherNotes: 'Good memorization.',
      })
      .expect(201);

    await agent
      .post('/api/quran/records')
      .send({
        studentId,
        date: new Date('2026-10-02T12:00:00.000Z').toISOString(),
        type: QuranLessonType.MURAJAAH,
        surahNumber: 1,
        fromAyah: 1,
        toAyah: 7,
        juz: 1,
        teacherAssessment: TeacherAssessment.EXCELLENT,
      })
      .expect(201);

    const summary = await agent.get(`/api/quran/students/${studentId}`).expect(200);
    expect(summary.body.data.sabaqSessions).toBe(1);
    expect(summary.body.data.murajaahSessions).toBe(1);
    expect(summary.body.data.pagesRecorded).toBe(2);
  });

  it('filters records by type', async () => {
    const agent = await loginAgent();
    const date = new Date('2026-10-01T12:00:00.000Z').toISOString();

    await agent.post('/api/quran/records').send({
      studentId,
      date,
      type: QuranLessonType.SABAQ,
      surahNumber: 112,
      fromAyah: 1,
      toAyah: 4,
      teacherAssessment: TeacherAssessment.GOOD,
    });

    const sabaqOnly = await agent.get('/api/quran/records').query({ type: QuranLessonType.SABAQ }).expect(200);
    expect(sabaqOnly.body.data.items).toHaveLength(1);

    const murajaahOnly = await agent.get('/api/quran/records').query({ type: QuranLessonType.MURAJAAH }).expect(200);
    expect(murajaahOnly.body.data.items).toHaveLength(0);
  });

  it('updates and deletes a record', async () => {
    const agent = await loginAgent();
    const created = await agent
      .post('/api/quran/records')
      .send({
        studentId,
        date: new Date('2026-10-01T12:00:00.000Z').toISOString(),
        type: QuranLessonType.SABAQ,
        surahNumber: 1,
        fromAyah: 1,
        toAyah: 7,
        teacherAssessment: TeacherAssessment.GOOD,
      })
      .expect(201);

    const recordId = created.body.data.id as string;

    await agent
      .put(`/api/quran/records/${recordId}`)
      .send({
        studentId,
        date: new Date('2026-10-03T12:00:00.000Z').toISOString(),
        type: QuranLessonType.SABAQ,
        surahNumber: 1,
        fromAyah: 1,
        toAyah: 5,
        teacherAssessment: TeacherAssessment.NEEDS_REVISION,
        teacherNotes: 'Review last section.',
      })
      .expect(200);

    expect(await QuranLessonRecordModel.countDocuments()).toBe(1);

    await agent.delete(`/api/quran/records/${recordId}`).expect(200);
    expect(await QuranLessonRecordModel.countDocuments()).toBe(0);
  });
});
