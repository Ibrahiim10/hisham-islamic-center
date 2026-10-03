import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { syncAllModelIndexes } from './models/index.js';

/**
 * Vercel serverless entry: boot MongoDB once per warm instance, then serve Express.
 * Local development continues to use server.ts (long-running listen).
 */
await connectDatabase();
await syncAllModelIndexes();

export default createApp();
