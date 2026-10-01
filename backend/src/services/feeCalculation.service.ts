import { PaymentModel } from '../models/Payment.model.js';
import { StudentModel } from '../models/Student.model.js';
import { StudentStatus } from '../types/enums.js';
import { resolveStudentFeeStatus, type StudentFeeStatus } from '../types/feeStatus.js';
import { buildActiveClassFeeMap, resolveFeeForClass } from './feeLookup.service.js';

function roundRate(value: number): number {
  return Math.round(value * 10) / 10;
}

function classKeyFromName(name: string): 'tahfidh' | 'farbar' | 'women' | 'other' {
  if (name === 'Tahfidh') return 'tahfidh';
  if (name === 'Farbar') return 'farbar';
  if (name === 'Women Section') return 'women';
  return 'other';
}

export type FeeClassBreakdown = {
  classKey: 'tahfidh' | 'farbar' | 'women' | 'other';
  className: string;
  studentCount: number;
  expected: number;
  collected: number;
  outstanding: number;
  collectionRate: number;
};

export type MonthlyFeeSummary = {
  month: number;
  year: number;
  monthKey: string;
  monthLabel: string;
  totalExpected: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionPercentage: number;
  studentsPaid: number;
  studentsPartial: number;
  studentsUnpaid: number;
  unpaidAccounts: number;
  byClass: FeeClassBreakdown[];
};

export type MonthlyFeeTrendPoint = {
  month: number;
  year: number;
  monthKey: string;
  monthLabel: string;
  expected: number;
  collected: number;
  outstanding: number;
};

export type StudentFeeAccountRow = {
  studentId: string;
  fullName: string;
  displayId: string;
  classId: string;
  className: string;
  monthlyFee: number;
  amountPaid: number;
  balance: number;
  month: number;
  year: number;
  status: StudentFeeStatus;
};

function buildMonthLabel(month: number, year: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString('en-KE', {
    month: 'long',
    year: 'numeric',
  });
}

function shiftMonth(month: number, year: number, offset: number): { month: number; year: number } {
  const date = new Date(year, month - 1 + offset, 1);
  return { month: date.getMonth() + 1, year: date.getFullYear() };
}

async function getPaidByStudentForMonth(month: number, year: number): Promise<Map<string, number>> {
  const rows = await PaymentModel.aggregate<{ _id: unknown; totalPaid: number }>([
    { $match: { month, year } },
    { $group: { _id: '$studentId', totalPaid: { $sum: '$amount' } } },
  ]);
  return new Map(rows.map((row) => [String(row._id), row.totalPaid]));
}

export async function computeMonthlyFeeSummary(month: number, year: number): Promise<MonthlyFeeSummary> {
  const monthKey = `${year}-${String(month).padStart(2, '0')}`;
  const [activeStudents, classFeeMap, paidByStudentId] = await Promise.all([
    StudentModel.find({ status: StudentStatus.ACTIVE }).lean(),
    buildActiveClassFeeMap(),
    getPaidByStudentForMonth(month, year),
  ]);

  const collectedResult = await PaymentModel.aggregate<{ total: number }>([
    { $match: { month, year } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalCollected = collectedResult[0]?.total ?? 0;

  let totalExpected = 0;
  let totalOutstanding = 0;
  let studentsPaid = 0;
  let studentsPartial = 0;
  let studentsUnpaid = 0;

  const feeBreakdownMap = new Map<
    string,
    {
      className: string;
      classKey: FeeClassBreakdown['classKey'];
      studentCount: number;
      expected: number;
      collected: number;
      outstanding: number;
    }
  >();

  for (const student of activeStudents) {
    const classInfo = resolveFeeForClass(classFeeMap, student.classId);
    const expected = classInfo.monthlyFee;
    const paid = paidByStudentId.get(student._id.toString()) ?? 0;
    const outstanding = Math.max(0, expected - paid);
    const status = resolveStudentFeeStatus(expected, paid);

    totalExpected += expected;
    totalOutstanding += outstanding;

    if (status === 'paid') studentsPaid += 1;
    else if (status === 'partial') studentsPartial += 1;
    else studentsUnpaid += 1;

    const breakdownKey = classInfo.classId;
    const existing = feeBreakdownMap.get(breakdownKey) ?? {
      className: classInfo.className,
      classKey: classKeyFromName(classInfo.className),
      studentCount: 0,
      expected: 0,
      collected: 0,
      outstanding: 0,
    };
    existing.studentCount += 1;
    existing.expected += expected;
    existing.collected += paid;
    existing.outstanding += outstanding;
    feeBreakdownMap.set(breakdownKey, existing);
  }

  const byClass: FeeClassBreakdown[] = [...feeBreakdownMap.values()]
    .map((row) => ({
      ...row,
      collectionRate: row.expected > 0 ? roundRate((row.collected / row.expected) * 100) : 0,
    }))
    .sort((a, b) => a.className.localeCompare(b.className));

  return {
    month,
    year,
    monthKey,
    monthLabel: buildMonthLabel(month, year),
    totalExpected,
    totalCollected,
    totalOutstanding,
    collectionPercentage: totalExpected > 0 ? roundRate((totalCollected / totalExpected) * 100) : 0,
    studentsPaid,
    studentsPartial,
    studentsUnpaid,
    unpaidAccounts: studentsPartial + studentsUnpaid,
    byClass,
  };
}

export async function computeMonthlyFeeTrend(
  endMonth: number,
  endYear: number,
  months = 6,
): Promise<MonthlyFeeTrendPoint[]> {
  const points: MonthlyFeeTrendPoint[] = [];
  for (let index = months - 1; index >= 0; index -= 1) {
    const { month, year } = shiftMonth(endMonth, endYear, -index);
    const summary = await computeMonthlyFeeSummary(month, year);
    points.push({
      month,
      year,
      monthKey: summary.monthKey,
      monthLabel: summary.monthLabel,
      expected: summary.totalExpected,
      collected: summary.totalCollected,
      outstanding: summary.totalOutstanding,
    });
  }
  return points;
}

function buildDisplayId(student: { _id: unknown; admissionNumber?: string | null }): string {
  if (student.admissionNumber) return student.admissionNumber;
  return `STU-${String(student._id).slice(-8).toUpperCase()}`;
}

export async function listStudentFeeAccounts(params: {
  month: number;
  year: number;
  search?: string;
  classId?: string;
  status?: StudentFeeStatus;
}): Promise<StudentFeeAccountRow[]> {
  const { month, year, search, classId, status } = params;
  const [activeStudents, classFeeMap, paidByStudentId] = await Promise.all([
    StudentModel.find({ status: StudentStatus.ACTIVE }).lean(),
    buildActiveClassFeeMap(),
    getPaidByStudentForMonth(month, year),
  ]);

  const rows: StudentFeeAccountRow[] = activeStudents.map((student) => {
    const classInfo = resolveFeeForClass(classFeeMap, student.classId);
    const monthlyFee = classInfo.monthlyFee;
    const amountPaid = paidByStudentId.get(student._id.toString()) ?? 0;
    const balance = Math.max(0, monthlyFee - amountPaid);
    return {
      studentId: student._id.toString(),
      fullName: student.fullName,
      displayId: buildDisplayId(student),
      classId: classInfo.classId,
      className: classInfo.className,
      monthlyFee,
      amountPaid,
      balance,
      month,
      year,
      status: resolveStudentFeeStatus(monthlyFee, amountPaid),
    };
  });

  return rows
    .filter((row) => {
      if (classId && row.classId !== classId) return false;
      if (status && row.status !== status) return false;
      if (search) {
        const term = search.toLowerCase();
        return (
          row.fullName.toLowerCase().includes(term) ||
          row.displayId.toLowerCase().includes(term) ||
          row.className.toLowerCase().includes(term)
        );
      }
      return true;
    })
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export async function getStudentFeeAccount(
  studentId: string,
  month: number,
  year: number,
): Promise<StudentFeeAccountRow | null> {
  const rows = await listStudentFeeAccounts({ month, year });
  return rows.find((row) => row.studentId === studentId) ?? null;
}
