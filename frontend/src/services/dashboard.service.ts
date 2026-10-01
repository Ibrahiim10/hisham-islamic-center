import axios from 'axios';
import type { DashboardOverview } from '../types/dashboard';
import { apiClient } from './apiClient';

type ApiSuccess<T> = { success: true; data: T };

export type DashboardOverviewParams = {
  month?: number;
  year?: number;
};

export async function fetchDashboardOverview(params?: DashboardOverviewParams): Promise<DashboardOverview> {
  const { data } = await apiClient.get<ApiSuccess<DashboardOverview>>('/dashboard/overview', { params });
  return data.data;
}

export function getDashboardErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Unable to reach the server. Check your connection and try again.';
    }
    const message = (error.response.data as { message?: string } | undefined)?.message;
    if (message) return message;
  }
  return fallback;
}
