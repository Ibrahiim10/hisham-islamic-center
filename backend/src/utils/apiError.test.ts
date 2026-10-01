import { describe, expect, it } from 'vitest';
import { ApiError } from './apiError.js';

describe('ApiError', () => {
  it('stores status code and message', () => {
    const err = new ApiError(404, 'Not found');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Not found');
  });
});
