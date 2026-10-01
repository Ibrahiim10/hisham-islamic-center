import { AttendanceModel } from '../models/Attendance.model.js';
import { PaymentModel } from '../models/Payment.model.js';
import { StudentModel } from '../models/Student.model.js';
import { AttendanceStatus, StudentStatus } from '../types/enums.js';
import { computeMonthlyFeeSummary, computeMonthlyFeeTrend, type MonthlyFeeTrendPoint } from './feeCalculation.service.js';
import { buildActiveClassFeeMap, resolveFeeForClass } from './feeLookup.service.js';
import type { DashboardOverviewQuery } from '../validators/dashboard.validators.js';

export type DashboardFeeClassBreakdown = {
  classKey: 'tahfidh' | 'farbar' | 'women' | 'other';
  className: string;
  studentCount: number;
  expected: number;
  collected: number;
  outstanding: number;
  collectionRate: number;
};

export type DashboardOverview = {
  students: {
    total: number;
    tahfidh: number;
    farbar: number;
    women: number;
  };
  attendance: {
    date: string;
    present: number;
    absent: number;
    presentRate: number;
    absenceRate: number;
    markedCount: number;
    unmarkedCount: number;
  };
  fees: {
    month: number;
    year: number;
    monthKey: string;
    monthLabel: string;
    expected: number;
    collected: number;
    outstanding: number;
    collectionRate: number;
    unpaidAccounts: number;
    byClass: DashboardFeeClassBreakdown[];
    studentsPaid: number;
    studentsPartial: number;
    studentsUnpaid: number;
  };
  feeMonthlyTrend: MonthlyFeeTrendPoint[];
  weeklyAttendance: Array<{
    day: string;
    date: string;
    presentRate: number;
    isToday: boolean;
    isFuture: boolean;
  }>;
  recentPayments: Array<{
    id: string;
    studentName: string;
    displayId: string;
    className: string;
    amount: number;
    method: string;
    reference: string;
    paymentDate: string;
    month: number;
    year: number;
  }>;
};

function getLocalDayRange(reference = new Date()): { start: Date; end: Date; dateKey: string } {
  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);
  const end = new Date(reference);
  end.setHours(23, 59, 59, 999);
  const dateKey = start.toISOString().slice(0, 10);
  return { start, end, dateKey };
}

function roundRate(value: number): number {
  return Math.round(value * 10) / 10;
}

function getMonthContext(query: DashboardOverviewQuery): { month: number; year: number } {
  const now = new Date();
  return {
    month: query.month ?? now.getMonth() + 1,
    year: query.year ?? now.getFullYear(),
  };
}

function buildWeekdayAttendance(reference = new Date()): Array<{ start: Date; end: Date; day: string; dateKey: string; isToday: boolean; isFuture: boolean }> {
  const days: Array<{ start: Date; end: Date; day: string; dateKey: string; isToday: boolean; isFuture: boolean }> = [];
  const today = new Date(reference);
  today.setHours(0, 0, 0, 0);

  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;
  for (let index = 0; index < 5; index += 1) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + index);
    const start = new Date(dayDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dayDate);
    end.setHours(23, 59, 59, 999);
    const isFuture = start > today;
    const isToday = start.getTime() === today.getTime();
    days.push({
      start,
      end,
      day: labels[index] ?? 'Day',
      dateKey: start.toISOString().slice(0, 10),
      isToday,
      isFuture,
    });
  }
  return days;
}

export async function getDashboardOverview(query: DashboardOverviewQuery = {}): Promise<DashboardOverview> {
  const { month, year } = getMonthContext(query);

  const [activeStudents, classFeeMap, todayRange, weekDays] = await Promise.all([
    StudentModel.find({ status: StudentStatus.ACTIVE }).lean(),
    buildActiveClassFeeMap(),
    Promise.resolve(getLocalDayRange()),
    Promise.resolve(buildWeekdayAttendance()),
  ]);

  const studentsTotal = activeStudents.length;
  let tahfidh = 0;
  let farbar = 0;
  let women = 0;

  for (const student of activeStudents) {
    const classInfo = resolveFeeForClass(classFeeMap, student.classId);
    if (classInfo.className === 'Tahfidh') tahfidh += 1;
    else if (classInfo.className === 'Farbar') farbar += 1;
    else if (classInfo.className === 'Women Section') women += 1;
  }

  const [presentAgg, absentAgg] = await Promise.all([
    AttendanceModel.aggregate<{ count: number }>([
      { $match: { date: { $gte: todayRange.start, $lte: todayRange.end }, status: AttendanceStatus.PRESENT } },
      { $group: { _id: '$studentId' } },
      { $count: 'count' },
    ]),
    AttendanceModel.aggregate<{ count: number }>([
      { $match: { date: { $gte: todayRange.start, $lte: todayRange.end }, status: AttendanceStatus.ABSENT } },
      { $group: { _id: '$studentId' } },
      { $count: 'count' },
    ]),
  ]);

  const present = presentAgg[0]?.count ?? 0;
  const absent = absentAgg[0]?.count ?? 0;
  const markedCount = present + absent;
  const presentRate = studentsTotal > 0 ? roundRate((present / studentsTotal) * 100) : 0;
  const absenceRate = studentsTotal > 0 ? roundRate((absent / studentsTotal) * 100) : 0;

  const [feeSummary, feeMonthlyTrend] = await Promise.all([
    computeMonthlyFeeSummary(month, year),
    computeMonthlyFeeTrend(month, year, 6),
  ]);

  const weekRateResults = await Promise.all(
    weekDays.map(async (day) => {
      if (day.isFuture || studentsTotal === 0) {
        return { day: day.day, date: day.dateKey, presentRate: 0, isToday: day.isToday, isFuture: day.isFuture };
      }
      const dayPresentAgg = await AttendanceModel.aggregate<{ count: number }>([
        { $match: { date: { $gte: day.start, $lte: day.end }, status: AttendanceStatus.PRESENT } },
        { $group: { _id: '$studentId' } },
        { $count: 'count' },
      ]);
      const dayPresent = dayPresentAgg[0]?.count ?? 0;
      return {
        day: day.day,
        date: day.dateKey,
        presentRate: roundRate((dayPresent / studentsTotal) * 100),
        isToday: day.isToday,
        isFuture: day.isFuture,
      };
    }),
  );

  const recentPaymentDocs = await PaymentModel.find()
    .sort({ paymentDate: -1 })
    .limit(8)
    .populate({ path: 'studentId', select: 'fullName admissionNumber classId' })
    .lean();

  const recentPayments = await Promise.all(
    recentPaymentDocs.map(async (payment) => {
      const student = payment.studentId as {
        _id: unknown;
        fullName?: string;
        admissionNumber?: string;
        classId?: unknown;
      } | null;
      const classInfo = student?.classId ? resolveFeeForClass(classFeeMap, student.classId as never) : null;
      const displayId =
        student?.admissionNumber ??
        (student?._id ? `STU-${String(student._id).slice(-8).toUpperCase()}` : '—');

      return {
        id: payment._id.toString(),
        studentName: student?.fullName ?? 'Unknown student',
        displayId,
        className: classInfo?.className ?? '—',
        amount: payment.amount,
        method: payment.paymentMethod.toUpperCase(),
        reference: payment.mpesaReference ?? '—',
        paymentDate: payment.paymentDate.toISOString(),
        month: payment.month,
        year: payment.year,
      };
    }),
  );

  return {
    students: { total: studentsTotal, tahfidh, farbar, women },
    attendance: {
      date: todayRange.dateKey,
      present,
      absent,
      presentRate,
      absenceRate,
      markedCount,
      unmarkedCount: Math.max(0, studentsTotal - markedCount),
    },
    fees: {
      month: feeSummary.month,
      year: feeSummary.year,
      monthKey: feeSummary.monthKey,
      monthLabel: feeSummary.monthLabel,
      expected: feeSummary.totalExpected,
      collected: feeSummary.totalCollected,
      outstanding: feeSummary.totalOutstanding,
      collectionRate: feeSummary.collectionPercentage,
      unpaidAccounts: feeSummary.unpaidAccounts,
      studentsPaid: feeSummary.studentsPaid,
      studentsPartial: feeSummary.studentsPartial,
      studentsUnpaid: feeSummary.studentsUnpaid,
      byClass: feeSummary.byClass,
    },
    feeMonthlyTrend,
    weeklyAttendance: weekRateResults,
    recentPayments,
    // Expose weekly average via extending type - actually not in spec, use computed on frontend from weekRateResults
  };
}

// Attach computed weekly average helper for tests if needed
export function getWeeklyAttendanceAverage(days: DashboardOverview['weeklyAttendance']): number {
  const completed = days.filter((day) => !day.isFuture);
  if (completed.length === 0) return 0;
  return roundRate(completed.reduce((sum, day) => sum + day.presentRate, 0) / completed.length);
}
