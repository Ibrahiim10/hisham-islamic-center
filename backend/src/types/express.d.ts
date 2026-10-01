import type { PublicUser } from '../utils/userMapper.js';

declare global {
  namespace Express {
    interface Request {
      authUser?: PublicUser;
    }
  }
}

export {};
