import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/hisham_test',
      CLIENT_URL: 'http://localhost:5173',
      JWT_SECRET: 'test-jwt-secret-min-16-chars',
      JWT_EXPIRES_IN: '1h',
      AUTH_COOKIE_NAME: 'hisham_auth_test',
    },
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
});
