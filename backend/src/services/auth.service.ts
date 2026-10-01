import { UserModel } from '../models/User.model.js';
import { ApiError } from '../utils/apiError.js';
import { verifyPassword } from '../utils/password.js';
import { signAuthToken } from '../utils/jwt.js';
import { toPublicUser, type PublicUser } from '../utils/userMapper.js';
import type { LoginBody } from '../validators/auth.validators.js';

export async function loginAdmin(credentials: LoginBody): Promise<{ token: string; user: PublicUser }> {
  const email = credentials.email.toLowerCase();
  const user = await UserModel.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account is inactive. Contact the system administrator.');
  }

  const passwordMatches = await verifyPassword(credentials.password, user.passwordHash);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  user.lastLogin = new Date();
  await user.save();

  const userForResponse = await UserModel.findById(user._id);
  if (!userForResponse) {
    throw new ApiError(500, 'Unable to load user profile');
  }

  const token = signAuthToken({
    sub: userForResponse._id.toString(),
    role: userForResponse.role,
  });

  return {
    token,
    user: toPublicUser(userForResponse),
  };
}

export async function getAuthenticatedUser(userId: string): Promise<PublicUser> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(401, 'Authentication required');
  }
  if (!user.isActive) {
    throw new ApiError(403, 'This account is inactive. Contact the system administrator.');
  }
  return toPublicUser(user);
}
