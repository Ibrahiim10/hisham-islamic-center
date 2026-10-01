export type UserRole = 'admin' | 'teacher' | 'accountant' | 'parent' | 'student';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthSuccessResponse = {
  success: true;
  user: AuthUser;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};
