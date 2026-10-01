import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { connectDatabase, disconnectDatabase, getDatabaseState } from './database.js';
import { AttendanceModel } from '../models/Attendance.model.js';
import { syncAllModelIndexes } from '../models/index.js';

describe('database connection', () => {
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

  it('connects to MongoDB', () => {
    expect(getDatabaseState()).toBe('connected');
  });

  it('creates attendance unique index for student + date', async () => {
    const indexes = await AttendanceModel.collection.indexes();
    const compound = indexes.find((index) => index.name === 'studentId_1_date_1');
    expect(compound?.unique).toBe(true);
  });
});
