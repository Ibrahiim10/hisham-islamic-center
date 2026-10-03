import type { AuthUser } from './auth';

export type AdminUser = AuthUser;

export type CreateAdminPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin';
  isActive: boolean;
};

export type UpdateAdminPayload = {
  fullName: string;
  email: string;
  role: 'admin';
  isActive: boolean;
};

export type ChangeAdminPasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
