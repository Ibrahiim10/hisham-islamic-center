import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { AttendanceModel } from './Attendance.model.js';
import { ClassModel } from './Class.model.js';
import { FeeStructureModel } from './FeeStructure.model.js';
import { IslamicContentModel } from './IslamicContent.model.js';
import { NotificationModel } from './Notification.model.js';
import { PaymentModel } from './Payment.model.js';
import { QuranLearningRecordModel } from './QuranLearningRecord.model.js';
import { StudentModel } from './Student.model.js';
import { UserModel } from './User.model.js';
import { syncAllModelIndexes } from './index.js';
import {
  AttendanceStatus,
  Gender,
  IslamicContentType,
  NotificationChannel,
  NotificationStatus,
  PaymentMethod,
  StudentStatus,
  UserRole,
} from '../types/enums.js';

describe('mongoose models', () => {
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

  it('registers all required models', () => {
    expect(UserModel.modelName).toBe('User');
    expect(StudentModel.modelName).toBe('Student');
    expect(ClassModel.modelName).toBe('Class');
    expect(FeeStructureModel.modelName).toBe('FeeStructure');
    expect(PaymentModel.modelName).toBe('Payment');
    expect(AttendanceModel.modelName).toBe('Attendance');
    expect(NotificationModel.modelName).toBe('Notification');
    expect(IslamicContentModel.modelName).toBe('IslamicContent');
    expect(QuranLearningRecordModel.modelName).toBe('QuranLearningRecord');
  });

  it('enforces unique attendance per student and date', async () => {
    const classDoc = await ClassModel.create({ name: 'Test Class' });
    const student = await StudentModel.create({
      fullName: 'Test Student',
      dateOfBirth: new Date('2012-01-01'),
      gender: Gender.MALE,
      parentPhone: '+254711111111',
      address: 'Test Address',
      classId: classDoc._id,
      studentType: 'regular',
      admissionDate: new Date('2024-01-01'),
      status: StudentStatus.ACTIVE,
    });
    const user = await UserModel.create({
      email: 'test-admin@hisham.local',
      passwordHash: 'hashed-password-placeholder',
      fullName: 'Test Admin',
      role: UserRole.ADMIN,
    });

    const date = new Date('2025-10-01T00:00:00.000Z');
    await AttendanceModel.create({
      studentId: student._id,
      date,
      status: AttendanceStatus.PRESENT,
      recordedBy: user._id,
    });

    await expect(
      AttendanceModel.create({
        studentId: student._id,
        date,
        status: AttendanceStatus.ABSENT,
        recordedBy: user._id,
      }),
    ).rejects.toThrow();
  });

  it('enforces unique mpesa reference when provided', async () => {
    const classDoc = await ClassModel.create({ name: 'Payment Class' });
    const student = await StudentModel.create({
      fullName: 'Payment Student',
      dateOfBirth: new Date('2012-02-02'),
      gender: Gender.FEMALE,
      parentPhone: '+254722222222',
      address: 'Payment Address',
      classId: classDoc._id,
      studentType: 'regular',
      admissionDate: new Date('2024-02-01'),
      status: StudentStatus.ACTIVE,
    });
    const user = await UserModel.create({
      email: 'payment-admin@hisham.local',
      passwordHash: 'hashed-password-placeholder',
      fullName: 'Payment Admin',
      role: UserRole.ADMIN,
    });

    await PaymentModel.create({
      studentId: student._id,
      month: 9,
      year: 2025,
      amount: 1000,
      paymentMethod: PaymentMethod.MPESA,
      paymentDate: new Date(),
      mpesaReference: 'UNIQUE123',
      recordedBy: user._id,
    });

    await expect(
      PaymentModel.create({
        studentId: student._id,
        month: 10,
        year: 2025,
        amount: 1000,
        paymentMethod: PaymentMethod.MPESA,
        paymentDate: new Date(),
        mpesaReference: 'UNIQUE123',
        recordedBy: user._id,
      }),
    ).rejects.toThrow();
  });

  it('stores Islamic content with required source metadata', async () => {
    const content = await IslamicContentModel.create({
      type: IslamicContentType.QURAN,
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      translation: 'Say, "He is Allah, [who is] One."',
      source: "Qur'an 112:1",
      surah: 'Al-Ikhlas',
      ayah: 1,
    });

    expect(content.source).toContain('112');
  });

  it('supports notification dedupe keys', async () => {
    const classDoc = await ClassModel.create({ name: 'Notify Class' });
    const student = await StudentModel.create({
      fullName: 'Notify Student',
      dateOfBirth: new Date('2013-03-03'),
      gender: Gender.MALE,
      parentPhone: '+254733333333',
      address: 'Notify Address',
      classId: classDoc._id,
      studentType: 'regular',
      admissionDate: new Date('2024-03-01'),
      status: StudentStatus.ACTIVE,
    });

    await NotificationModel.create({
      studentId: student._id,
      parentPhone: student.parentPhone,
      message: 'Demo notification',
      channel: NotificationChannel.SMS,
      status: NotificationStatus.PENDING,
      dedupeKey: 'dedupe-test-key',
    });

    await expect(
      NotificationModel.create({
        studentId: student._id,
        parentPhone: student.parentPhone,
        message: 'Duplicate notification',
        channel: NotificationChannel.SMS,
        status: NotificationStatus.PENDING,
        dedupeKey: 'dedupe-test-key',
      }),
    ).rejects.toThrow();
  });
});
