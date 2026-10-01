import { Types } from 'mongoose';
import { ApiError } from './apiError.js';

export function parseObjectId(value: string, label = 'id'): Types.ObjectId {
  if (!Types.ObjectId.isValid(value)) {
    throw new ApiError(400, `Invalid ${label}`);
  }
  return new Types.ObjectId(value);
}
