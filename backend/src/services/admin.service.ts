import { UserModel } from '../models/User.model.js';
import { UserRole } from '../types/enums.js';
import { ApiError } from '../utils/apiError.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { parseObjectId } from '../utils/objectId.js';
import { toPublicUser, type PublicUser } from '../utils/userMapper.js';
import type {
  ChangeAdminPasswordBody,
  CreateAdminBody,
  UpdateAdminBody,
} from '../validators/admin.validators.js';

async function countActiveAdmins(excludeId?: string): Promise<number> {
  const filter: Record<string, unknown> = { role: UserRole.ADMIN, isActive: true };
  if (excludeId) {
    filter._id = { $ne: parseObjectId(excludeId, 'admin id') };
  }
  return UserModel.countDocuments(filter);
}

export async function listAdmins(): Promise<PublicUser[]> {
  const users = await UserModel.find({ role: UserRole.ADMIN }).sort({ fullName: 1 });
  return users.map((user) => toPublicUser(user));
}

export async function createAdmin(body: CreateAdminBody): Promise<PublicUser> {
  const email = body.email.toLowerCase();
  const existing = await UserModel.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const passwordHash = await hashPassword(body.password);
  const user = await UserModel.create({
    email,
    passwordHash,
    fullName: body.fullName.trim(),
    role: UserRole.ADMIN,
    isActive: body.isActive,
  });

  return toPublicUser(user);
}

export async function updateAdmin(id: string, body: UpdateAdminBody, actorId: string): Promise<PublicUser> {
  const user = await UserModel.findById(parseObjectId(id, 'admin id'));
  if (!user || user.role !== UserRole.ADMIN) {
    throw new ApiError(404, 'Administrator not found');
  }

  const email = body.email.toLowerCase();
  if (email !== user.email) {
    const duplicate = await UserModel.findOne({ email, _id: { $ne: user._id } });
    if (duplicate) {
      throw new ApiError(409, 'An account with this email already exists');
    }
    user.email = email;
  }

  if (!body.isActive && user.isActive) {
    const activeOthers = await countActiveAdmins(user._id.toString());
    if (activeOthers === 0) {
      throw new ApiError(400, 'Cannot deactivate the last active administrator');
    }
    if (user._id.toString() === actorId) {
      throw new ApiError(400, 'You cannot deactivate your own account');
    }
  }

  user.fullName = body.fullName.trim();
  user.role = UserRole.ADMIN;
  user.isActive = body.isActive;
  await user.save();

  return toPublicUser(user);
}

export async function deleteAdmin(id: string, actorId: string): Promise<void> {
  const user = await UserModel.findById(parseObjectId(id, 'admin id'));
  if (!user || user.role !== UserRole.ADMIN) {
    throw new ApiError(404, 'Administrator not found');
  }

  if (user._id.toString() === actorId) {
    throw new ApiError(400, 'You cannot delete your own administrator account');
  }

  if (user.isActive) {
    const activeOthers = await countActiveAdmins(user._id.toString());
    if (activeOthers === 0) {
      throw new ApiError(400, 'Cannot delete the last active administrator');
    }
  }

  await UserModel.deleteOne({ _id: user._id });
}

export async function changeAdminPassword(
  targetId: string,
  actorId: string,
  body: ChangeAdminPasswordBody,
): Promise<void> {
  const target = await UserModel.findById(parseObjectId(targetId, 'admin id')).select('+passwordHash');
  if (!target || target.role !== UserRole.ADMIN) {
    throw new ApiError(404, 'Administrator not found');
  }

  const actor = await UserModel.findById(parseObjectId(actorId, 'actor id')).select('+passwordHash');
  if (!actor) {
    throw new ApiError(401, 'Authentication required');
  }

  const isSelf = target._id.toString() === actorId;
  const passwordToVerify = isSelf ? target.passwordHash : actor.passwordHash;
  const currentMatches = await verifyPassword(body.currentPassword, passwordToVerify);
  if (!currentMatches) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  target.passwordHash = await hashPassword(body.newPassword);
  await target.save();
}
