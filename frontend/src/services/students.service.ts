import axios from 'axios';
import type {
  StudentClassOption,
  StudentDetail,
  StudentFormValues,
  StudentsListResponse,
} from '../types/student';
import { apiClient } from './apiClient';

type ApiSuccess<T> = { success: true; data: T };

export type ListStudentsParams = {
  search?: string;
  classId?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
};

export async function fetchStudentClasses(): Promise<StudentClassOption[]> {
  const { data } = await apiClient.get<ApiSuccess<StudentClassOption[]>>('/students/classes');
  return data.data;
}

export async function fetchStudents(params: ListStudentsParams): Promise<StudentsListResponse> {
  const { data } = await apiClient.get<ApiSuccess<StudentsListResponse>>('/students', { params });
  return data.data;
}

export async function fetchStudentById(id: string): Promise<StudentDetail> {
  const { data } = await apiClient.get<ApiSuccess<StudentDetail>>(`/students/${id}`);
  return data.data;
}

export async function createStudent(payload: StudentFormValues): Promise<StudentDetail> {
  const { data } = await apiClient.post<ApiSuccess<StudentDetail>>('/students', payload);
  return data.data;
}

export async function updateStudent(id: string, payload: StudentFormValues): Promise<StudentDetail> {
  const { data } = await apiClient.put<ApiSuccess<StudentDetail>>(`/students/${id}`, payload);
  return data.data;
}

export function getStudentApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Unable to reach the server. Check your connection and try again.';
    }
    const message = (error.response.data as { message?: string } | undefined)?.message;
    if (message) return message;
    if (error.response.status === 404) return 'Student not found.';
    if (error.response.status >= 500) return 'The server is unavailable. Please try again shortly.';
  }
  return fallback;
}
