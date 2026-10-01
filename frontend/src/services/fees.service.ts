import axios from 'axios';
import type {
  FeeAccountRow,
  FeeClassConfig,
  FeeMonthlyTrendPoint,
  FeePaymentRecord,
  FeeSummary,
  RecordPaymentPayload,
} from '../types/fees';
import { apiClient } from './apiClient';

type ApiSuccess<T> = { success: true; data: T };
type ApiListSuccess<T> = { success: true; data: { items: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } } };

export async function fetchFeeSummary(params?: { month?: number; year?: number }): Promise<FeeSummary> {
  const { data } = await apiClient.get<ApiSuccess<FeeSummary>>('/fees/summary', { params });
  return data.data;
}

export async function fetchFeeTrends(params?: { month?: number; year?: number; months?: number }): Promise<FeeMonthlyTrendPoint[]> {
  const { data } = await apiClient.get<ApiSuccess<FeeMonthlyTrendPoint[]>>('/fees/trends', { params });
  return data.data;
}

export async function fetchFeeClassConfig(): Promise<FeeClassConfig[]> {
  const { data } = await apiClient.get<ApiSuccess<FeeClassConfig[]>>('/fees/config');
  return data.data;
}

export async function fetchFeeAccounts(params: {
  month?: number;
  year?: number;
  search?: string;
  classId?: string;
  status?: 'paid' | 'partial' | 'unpaid';
}): Promise<FeeAccountRow[]> {
  const { data } = await apiClient.get<ApiSuccess<FeeAccountRow[]>>('/fees/accounts', { params });
  return data.data;
}

export async function fetchFeePayments(params: {
  month?: number;
  year?: number;
  search?: string;
  classId?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: FeePaymentRecord[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const { data } = await apiClient.get<ApiListSuccess<FeePaymentRecord>>('/fees', { params });
  return data.data;
}

export async function recordFeePayment(payload: RecordPaymentPayload): Promise<FeePaymentRecord> {
  const { data } = await apiClient.post<ApiSuccess<FeePaymentRecord>>('/fees/payments', payload);
  return data.data;
}

export function getFeeApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Unable to reach the server. Check your connection and try again.';
    }
    const message = (error.response.data as { message?: string } | undefined)?.message;
    if (message) return message;
    if (error.response.status === 409) return 'This M-Pesa reference has already been used.';
  }
  return fallback;
}
