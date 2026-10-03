/**
 * Development verification — exercises real auth routes against configured MONGODB_URI.
 * Usage: VERIFY_ADMIN_EMAIL=... VERIFY_ADMIN_PASSWORD=... npm run verify:admin-login
 */
import request from 'supertest';
import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { syncAllModelIndexes } from '../models/index.js';

const email = (process.env.VERIFY_ADMIN_EMAIL ?? '').trim().toLowerCase();
const password = process.env.VERIFY_ADMIN_PASSWORD ?? '';

async function main(): Promise<void> {
  if (!email || !password) {
    throw new Error('Set VERIFY_ADMIN_EMAIL and VERIFY_ADMIN_PASSWORD (not logged).');
  }

  await connectDatabase();
  await syncAllModelIndexes();
  const app = createApp();
  const agent = request.agent(app);

  const login = await agent.post('/api/auth/login').send({ email, password });
  console.log('POST /api/auth/login status:', login.status);
  console.log('login success:', login.body.success === true);
  console.log('passwordHash in body:', login.body.user?.passwordHash !== undefined);

  const me = await agent.get('/api/auth/me');
  console.log('GET /api/auth/me status:', me.status);

  const admins = await agent.get('/api/admins');
  console.log('GET /api/admins status:', admins.status);

  if (login.status !== 200 || me.status !== 200 || admins.status !== 200) {
    process.exitCode = 1;
  }
}

main()
  .catch((error: unknown) => {
    console.error('Verify admin login failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
