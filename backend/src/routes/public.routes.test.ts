import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { AdmissionApplicationModel } from '../models/AdmissionApplication.model.js';
import { ContactInquiryModel } from '../models/ContactInquiry.model.js';
import { syncAllModelIndexes } from '../models/index.js';

describe('public API', () => {
  let memoryServer: MongoMemoryServer;
  const app = createApp();

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
    await Promise.all([AdmissionApplicationModel.deleteMany({}), ContactInquiryModel.deleteMany({})]);
  });

  it('accepts admission submissions without auth', async () => {
    const res = await request(app).post('/api/public/admissions').send({
      studentFullName: 'Amina Hassan',
      dateOfBirth: '2015-06-01',
      gender: 'female',
      age: 10,
      parentGuardianName: 'Hassan Ali',
      contactPhone: '+254711000000',
      email: 'parent@example.com',
      residentialAddress: 'Parklands, Nairobi',
      programStream: 'regular_tahfidh',
      paymentPreference: 'mpesa',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(await AdmissionApplicationModel.countDocuments()).toBe(1);
  });

  it('accepts contact enquiries without auth', async () => {
    const res = await request(app).post('/api/public/contact').send({
      fullName: 'Visitor Name',
      email: 'visitor@example.com',
      message: 'I would like to know more about Farbar schedules.',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(await ContactInquiryModel.countDocuments()).toBe(1);
  });
});
