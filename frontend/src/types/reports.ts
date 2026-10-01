export type ReportProgram = 'tahfidh' | 'farbar' | 'women';

export type ReportTab = 'overview' | 'students' | 'attendance' | 'fees' | 'quran';

export type ReportQueryParams = {
  dateFrom?: string;
  dateTo?: string;
  month?: number;
  year?: number;
  studentId?: string;
  classId?: string;
  program?: ReportProgram;
  search?: string;
  page?: number;
  limit?: number;
  type?: 'sabaq' | 'murajaah';
  surahNumber?: number;
  paymentStatus?: 'paid' | 'partial' | 'unpaid';
  status?: 'active' | 'inactive';
};

export type ReportsOverview = {
  period: { dateFrom: string; dateTo: string; month: number; year: number };
  students: { total: number; active: number; inactive: number; tahfidh: number; farbar: number; women: number };
  attendance: { totalRecords: number; present: number; absent: number; rate: number };
  fees: { expected: number; collected: number; outstanding: number; collectionRate: number };
  quran: { sabaq: number; murajaah: number };
};

export type StudentReportResponse = {
  summary: { active: number; inactive: number; tahfidh: number; farbar: number; women: number };
  byProgramChart: Array<{ program: string; studentCount: number }>;
  items: Array<{
    id: string;
    displayId: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    parentPhone: string;
    program: string;
    monthlyFee: number;
    status: string;
  }>;
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type AttendanceReportResponse = {
  period: { dateFrom: string; dateTo: string };
  summary: { totalRecords: number; present: number; absent: number; attendanceRate: number };
  trend: Array<{ month: number; year: number; monthLabel: string; present: number; absent: number; rate: number }>;
  items: Array<{
    id: string;
    date: string;
    studentName: string;
    program: string;
    status: string;
  }>;
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type FeeReportResponse = {
  period: { month: number; year: number; dateFrom: string; dateTo: string };
  summary: {
    expected: number;
    collected: number;
    outstanding: number;
    collectionRate: number;
    studentsPaid: number;
    studentsUnpaid: number;
    studentsPartial: number;
  };
  trend: Array<{ monthLabel: string; collected: number; outstanding: number; expected: number }>;
  payments: Array<{
    id: string;
    studentName: string;
    program: string;
    month: number;
    year: number;
    amount: number;
    paymentMethod: string;
    mpesaReference: string;
    paymentDate: string;
    status: string;
  }>;
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type QuranReportResponse = {
  period: { dateFrom: string; dateTo: string };
  summary: { totalLessons: number; sabaqCount: number; murajaahCount: number; studentsWithLessons: number };
  activityByDate: Array<{ date: string; count: number }>;
  activityByProgram: Array<{ program: string; count: number }>;
  items: Array<{
    id: string;
    date: string;
    studentName: string;
    type: string;
    surahName: string;
    fromAyah: number;
    toAyah: number;
    juz: number | null;
    pageFrom: number | null;
    pageTo: number | null;
    teacherAssessment: string;
    teacherNotes: string | null;
  }>;
  pagination: { page: number; limit: number; total: number; totalPages: number };
};
