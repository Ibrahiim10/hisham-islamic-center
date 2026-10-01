import axios from 'axios';
import type { AuthSuccessResponse, AuthUser } from '../types/auth';
import { apiClient } from './apiClient';

export async function loginRequest(email: string, password: string): Promise<AuthUser> {
  const { data } = await apiClient.post<AuthSuccessResponse>('/auth/login', { email, password });
  return data.user;
}

export async function logoutRequest(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await apiClient.get<AuthSuccessResponse>('/auth/me');
    return data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Unable to reach the server. Check your connection and try again.';
    }
    const message = (error.response.data as { message?: string } | undefined)?.message;
    if (message) return message;
    if (error.response.status === 401) return 'Your session has expired. Please sign in again.';
    if (error.response.status >= 500) return 'The server is unavailable. Please try again shortly.';
  }
  return fallback;
}
