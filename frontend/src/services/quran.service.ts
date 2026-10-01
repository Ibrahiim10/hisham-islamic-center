import axios from 'axios';
import type {
  QuranLessonRecord,
  QuranModuleStats,
  QuranStudentSummary,
  SurahOption,
  TeacherAssessment,
  QuranLessonType,
} from '../types/quran';
import { apiClient } from './apiClient';

type ApiSuccess<T> = { success: true; data: T };
type ApiListSuccess<T> = {
  success: true;
  data: { items: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
};

export async function fetchSurahs(): Promise<SurahOption[]> {
  const { data } = await apiClient.get<ApiSuccess<SurahOption[]>>('/quran/surahs');
  return data.data;
}

export async function fetchQuranStats(): Promise<QuranModuleStats> {
  const { data } = await apiClient.get<ApiSuccess<QuranModuleStats>>('/quran/stats');
  return data.data;
}

export async function fetchQuranRecords(params: {
  search?: string;
  type?: QuranLessonType;
  studentId?: string;
  surahNumber?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) {
  const { data } = await apiClient.get<ApiListSuccess<QuranLessonRecord>>('/quran/records', { params });
  return data.data;
}

export async function fetchStudentQuranSummary(studentId: string): Promise<QuranStudentSummary> {
  const { data } = await apiClient.get<ApiSuccess<QuranStudentSummary>>(`/quran/students/${studentId}`);
  return data.data;
}

export async function createQuranRecord(payload: Record<string, unknown>): Promise<QuranLessonRecord> {
  const { data } = await apiClient.post<ApiSuccess<QuranLessonRecord>>('/quran/records', payload);
  return data.data;
}

export async function updateQuranRecord(id: string, payload: Record<string, unknown>): Promise<QuranLessonRecord> {
  const { data } = await apiClient.put<ApiSuccess<QuranLessonRecord>>(`/quran/records/${id}`, payload);
  return data.data;
}

export async function deleteQuranRecord(id: string): Promise<void> {
  await apiClient.delete(`/quran/records/${id}`);
}

export function getQuranApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Unable to reach the server. Check your connection and try again.';
    const message = (error.response.data as { message?: string } | undefined)?.message;
    if (message) return message;
  }
  return fallback;
}

export const ASSESSMENT_OPTIONS: Array<{ value: TeacherAssessment; label: string }> = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'needs_improvement', label: 'Needs Improvement' },
  { value: 'needs_revision', label: 'Needs Revision' },
];

export function formatAssessmentLabel(value: string): string {
  return ASSESSMENT_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
