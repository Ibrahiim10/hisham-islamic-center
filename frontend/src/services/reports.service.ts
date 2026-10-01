import axios from 'axios';
import type {
  AttendanceReportResponse,
  FeeReportResponse,
  QuranReportResponse,
  ReportQueryParams,
  ReportsOverview,
  StudentReportResponse,
} from '../types/reports';
import { apiClient } from './apiClient';

type ApiSuccess<T> = { success: true; data: T };

function buildParams(params: ReportQueryParams): Record<string, string | number | undefined> {
  return {
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    month: params.month,
    year: params.year,
    studentId: params.studentId,
    classId: params.classId,
    program: params.program,
    search: params.search,
    page: params.page,
    limit: params.limit,
    type: params.type,
    surahNumber: params.surahNumber,
    paymentStatus: params.paymentStatus,
    status: params.status,
  };
}

export async function fetchReportsOverview(params: ReportQueryParams): Promise<ReportsOverview> {
  const { data } = await apiClient.get<ApiSuccess<ReportsOverview>>('/reports/overview', { params: buildParams(params) });
  return data.data;
}

export async function fetchStudentReport(params: ReportQueryParams): Promise<StudentReportResponse> {
  const { data } = await apiClient.get<ApiSuccess<StudentReportResponse>>('/reports/students', { params: buildParams(params) });
  return data.data;
}

export async function fetchAttendanceReport(params: ReportQueryParams): Promise<AttendanceReportResponse> {
  const { data } = await apiClient.get<ApiSuccess<AttendanceReportResponse>>('/reports/attendance', { params: buildParams(params) });
  return data.data;
}

export async function fetchFeeReport(params: ReportQueryParams): Promise<FeeReportResponse> {
  const { data } = await apiClient.get<ApiSuccess<FeeReportResponse>>('/reports/fees', { params: buildParams(params) });
  return data.data;
}

export async function fetchQuranReport(params: ReportQueryParams): Promise<QuranReportResponse> {
  const { data } = await apiClient.get<ApiSuccess<QuranReportResponse>>('/reports/quran', { params: buildParams(params) });
  return data.data;
}

export function getReportsApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Unable to reach the server. Check your connection and try again.';
    }
    const message = (error.response.data as { message?: string } | undefined)?.message;
    if (message) return message;
  }
  return fallback;
}
