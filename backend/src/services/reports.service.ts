import { Types } from 'mongoose';
import { AttendanceModel } from '../models/Attendance.model.js';
import { PaymentModel } from '../models/Payment.model.js';
import { QuranLessonRecordModel } from '../models/QuranLessonRecord.model.js';
import { StudentModel } from '../models/Student.model.js';
import { AttendanceStatus, QuranLessonType, StudentStatus } from '../types/enums.js';
import type { StudentFeeStatus } from '../types/feeStatus.js';
import { resolveStudentFeeStatus } from '../types/feeStatus.js';
import type {
  ReportFeesQuery,
  ReportFiltersQuery,
  ReportOverviewQuery,
  ReportQuranQuery,
  ReportStudentsQuery,
} from '../validators/reports.validators.js';
import {
  endOfDay,
  resolveClassIdFromReportFilters,
  resolveDateRange,
  resolveMonthYear,
  roundRate,
  startOfDay,
} from '../utils/reportFilters.js';
import { parseObjectId } from '../utils/objectId.js';
import { computeMonthlyFeeSummary, computeMonthlyFeeTrend, listStudentFeeAccounts } from './feeCalculation.service.js';
import { buildActiveClassFeeMap, resolveFeeForClass } from './feeLookup.service.js';

type Pagination = { page: number; limit: number; total: number; totalPages: number };

function buildDisplayId(student: { _id: unknown; admissionNumber?: string | null }): string {
  if (student.admissionNumber) return student.admissionNumber;
  return `STU-${String(student._id).slice(-8).toUpperCase()}`;
}

async function resolveStudentObjectIds(params: {
  classId?: string;
  studentId?: string;
}): Promise<Types.ObjectId[] | undefined> {
  if (params.studentId) {
    return [parseObjectId(params.studentId, 'student id')];
  }
  if (!params.classId) return undefined;

  const students = await StudentModel.find({ classId: parseObjectId(params.classId, 'class id') })
    .select('_id')
    .lean();
  return students.map((student) => student._id);
}

async function resolveClassIdForQuery(query: {
  classId?: string;
  program?: 'tahfidh' | 'farbar' | 'women';
}): Promise<string | undefined> {
  return resolveClassIdFromReportFilters(query);
}

export async function getReportsOverview(query: ReportOverviewQuery) {
  const dateRange = resolveDateRange(query);
  const { month, year } = resolveMonthYear(query);
  const classId = await resolveClassIdForQuery(query);
  const studentIds = await resolveStudentObjectIds({ classId, studentId: query.studentId });

  const studentFilter: Record<string, unknown> = {};
  if (classId) studentFilter.classId = parseObjectId(classId, 'class id');
  if (query.studentId) studentFilter._id = parseObjectId(query.studentId, 'student id');

  const [activeCount, inactiveCount, classFeeMap] = await Promise.all([
    StudentModel.countDocuments({ ...studentFilter, status: StudentStatus.ACTIVE }),
    StudentModel.countDocuments({ ...studentFilter, status: StudentStatus.INACTIVE }),
    buildActiveClassFeeMap(),
  ]);

  const attendanceMatch: Record<string, unknown> = {
    date: { $gte: dateRange.from, $lte: dateRange.to },
  };
  if (studentIds) attendanceMatch.studentId = { $in: studentIds };

  const [presentAgg, absentAgg, totalAttendance] = await Promise.all([
    AttendanceModel.countDocuments({ ...attendanceMatch, status: AttendanceStatus.PRESENT }),
    AttendanceModel.countDocuments({ ...attendanceMatch, status: AttendanceStatus.ABSENT }),
    AttendanceModel.countDocuments(attendanceMatch),
  ]);

  const marked = presentAgg + absentAgg;
  const attendanceRate = marked > 0 ? roundRate((presentAgg / marked) * 100) : 0;

  let feesSummary;
  if (classId || query.studentId) {
    let accounts = await listStudentFeeAccounts({
      month,
      year,
      classId,
    });
    if (query.studentId) {
      accounts = accounts.filter((row) => row.studentId === query.studentId);
    }
    const totalExpected = accounts.reduce((sum, row) => sum + row.monthlyFee, 0);
    const totalCollected = accounts.reduce((sum, row) => sum + row.amountPaid, 0);
    const totalOutstanding = accounts.reduce((sum, row) => sum + row.balance, 0);
    feesSummary = {
      expected: totalExpected,
      collected: totalCollected,
      outstanding: totalOutstanding,
      collectionRate: totalExpected > 0 ? roundRate((totalCollected / totalExpected) * 100) : 0,
    };
  } else {
    const monthly = await computeMonthlyFeeSummary(month, year);
    feesSummary = {
      expected: monthly.totalExpected,
      collected: monthly.totalCollected,
      outstanding: monthly.totalOutstanding,
      collectionRate: monthly.collectionPercentage,
    };
  }

  const quranMatch: Record<string, unknown> = {
    date: { $gte: dateRange.from, $lte: dateRange.to },
  };
  if (studentIds) quranMatch.studentId = { $in: studentIds };

  const [sabaq, murajaah] = await Promise.all([
    QuranLessonRecordModel.countDocuments({ ...quranMatch, type: QuranLessonType.SABAQ }),
    QuranLessonRecordModel.countDocuments({ ...quranMatch, type: QuranLessonType.MURAJAAH }),
  ]);

  let tahfidh = 0;
  let farbar = 0;
  let women = 0;
  const activeStudents = await StudentModel.find({ ...studentFilter, status: StudentStatus.ACTIVE }).lean();
  for (const student of activeStudents) {
    const classInfo = resolveFeeForClass(classFeeMap, student.classId);
    if (classInfo.className === 'Tahfidh') tahfidh += 1;
    else if (classInfo.className === 'Farbar') farbar += 1;
    else if (classInfo.className === 'Women Section') women += 1;
  }

  return {
    period: {
      dateFrom: dateRange.from.toISOString(),
      dateTo: dateRange.to.toISOString(),
      month,
      year,
    },
    students: {
      total: activeCount + inactiveCount,
      active: activeCount,
      inactive: inactiveCount,
      tahfidh,
      farbar,
      women,
    },
    attendance: {
      totalRecords: totalAttendance,
      present: presentAgg,
      absent: absentAgg,
      rate: attendanceRate,
    },
    fees: feesSummary,
    quran: { sabaq, murajaah },
  };
}

export async function getStudentReport(query: ReportStudentsQuery) {
  const classId = await resolveClassIdForQuery(query);
  const classFeeMap = await buildActiveClassFeeMap();

  const filter: Record<string, unknown> = {};
  if (classId) filter.classId = parseObjectId(classId, 'class id');
  if (query.studentId) filter._id = parseObjectId(query.studentId, 'student id');
  if (query.status) filter.status = query.status;

  if (query.search) {
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    filter.$or = [{ fullName: regex }, { admissionNumber: regex }, { parentPhone: regex }];
  }

  const [activeCount, inactiveCount, tahfidhCount, farbarCount, womenCount] = await Promise.all([
    StudentModel.countDocuments({ ...filter, status: StudentStatus.ACTIVE }),
    StudentModel.countDocuments({ ...filter, status: StudentStatus.INACTIVE }),
    StudentModel.countDocuments({
      ...filter,
      status: StudentStatus.ACTIVE,
      classId: {
        $in: [...classFeeMap.values()]
          .filter((row) => row.className === 'Tahfidh')
          .map((row) => parseObjectId(row.classId, 'class id')),
      },
    }),
    StudentModel.countDocuments({
      ...filter,
      status: StudentStatus.ACTIVE,
      classId: {
        $in: [...classFeeMap.values()]
          .filter((row) => row.className === 'Farbar')
          .map((row) => parseObjectId(row.classId, 'class id')),
      },
    }),
    StudentModel.countDocuments({
      ...filter,
      status: StudentStatus.ACTIVE,
      classId: {
        $in: [...classFeeMap.values()]
          .filter((row) => row.className === 'Women Section')
          .map((row) => parseObjectId(row.classId, 'class id')),
      },
    }),
  ]);

  const skip = (query.page - 1) * query.limit;
  const [total, students] = await Promise.all([
    StudentModel.countDocuments(filter),
    StudentModel.find(filter).sort({ fullName: 1 }).skip(skip).limit(query.limit).lean(),
  ]);

  const rows = students.map((student) => {
    const classInfo = resolveFeeForClass(classFeeMap, student.classId);
    return {
      id: student._id.toString(),
      displayId: buildDisplayId(student),
      fullName: student.fullName,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth.toISOString(),
      parentPhone: student.parentPhone,
      program: classInfo.className,
      classId: classInfo.classId,
      monthlyFee: classInfo.monthlyFee,
      status: student.status,
    };
  });

  const byProgram = await Promise.all(
    [...classFeeMap.values()].map(async (classInfo) => ({
      program: classInfo.className,
      studentCount: await StudentModel.countDocuments({
        ...filter,
        classId: parseObjectId(classInfo.classId, 'class id'),
      }),
    })),
  );

  return {
    summary: {
      active: activeCount,
      inactive: inactiveCount,
      tahfidh: tahfidhCount,
      farbar: farbarCount,
      women: womenCount,
    },
    byProgramChart: byProgram,
    items: rows,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    } satisfies Pagination,
  };
}

export async function getAttendanceReport(query: ReportFiltersQuery) {
  const dateRange = resolveDateRange(query);
  const classId = await resolveClassIdForQuery(query);
  const studentIds = await resolveStudentObjectIds({ classId, studentId: query.studentId });
  const classFeeMap = await buildActiveClassFeeMap();

  const match: Record<string, unknown> = {
    date: { $gte: dateRange.from, $lte: dateRange.to },
  };
  if (studentIds) match.studentId = { $in: studentIds };

  const [present, absent, totalRecords] = await Promise.all([
    AttendanceModel.countDocuments({ ...match, status: AttendanceStatus.PRESENT }),
    AttendanceModel.countDocuments({ ...match, status: AttendanceStatus.ABSENT }),
    AttendanceModel.countDocuments(match),
  ]);

  const marked = present + absent;
  const attendanceRate = marked > 0 ? roundRate((present / marked) * 100) : 0;

  const monthlyTrend = await AttendanceModel.aggregate<{
    _id: { year: number; month: number };
    present: number;
    absent: number;
  }>([
    { $match: match },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        present: { $sum: { $cond: [{ $eq: ['$status', AttendanceStatus.PRESENT] }, 1, 0] } },
        absent: { $sum: { $cond: [{ $eq: ['$status', AttendanceStatus.ABSENT] }, 1, 0] } },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const trend = monthlyTrend.map((point) => {
    const total = point.present + point.absent;
    const monthLabel = new Date(point._id.year, point._id.month - 1, 1).toLocaleDateString('en-KE', {
      month: 'short',
    });
    return {
      month: point._id.month,
      year: point._id.year,
      monthLabel,
      present: point.present,
      absent: point.absent,
      rate: total > 0 ? roundRate((point.present / total) * 100) : 0,
    };
  });

  const skip = (query.page - 1) * query.limit;
  const [total, records] = await Promise.all([
    AttendanceModel.countDocuments(match),
    AttendanceModel.find(match).sort({ date: -1 }).skip(skip).limit(query.limit).populate({ path: 'studentId', select: 'fullName classId admissionNumber' }).lean(),
  ]);

  const items = records.map((record) => {
    const student = record.studentId as { fullName?: string; classId?: Types.ObjectId; admissionNumber?: string; _id?: Types.ObjectId } | null;
    const className = student?.classId ? resolveFeeForClass(classFeeMap, student.classId).className : '—';
    return {
      id: record._id.toString(),
      date: record.date.toISOString(),
      studentId: student?._id?.toString() ?? '',
      studentName: student?.fullName ?? 'Unknown student',
      displayId: student?._id ? buildDisplayId({ _id: student._id, admissionNumber: student.admissionNumber }) : '—',
      program: className,
      status: record.status,
    };
  });

  return {
    period: { dateFrom: dateRange.from.toISOString(), dateTo: dateRange.to.toISOString() },
    summary: { totalRecords, present, absent, attendanceRate },
    trend,
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    } satisfies Pagination,
  };
}

export async function getFeeReport(query: ReportFeesQuery) {
  const { month, year } = resolveMonthYear(query);
  const dateRange = resolveDateRange(query);
  const classId = await resolveClassIdForQuery(query);

  let accounts = await listStudentFeeAccounts({
    month,
    year,
    classId,
    status: query.paymentStatus,
    search: query.search,
  });
  if (query.studentId) {
    accounts = accounts.filter((row) => row.studentId === query.studentId);
  }

  const summaryFromAccounts = {
    expected: accounts.reduce((sum, row) => sum + row.monthlyFee, 0),
    collected: accounts.reduce((sum, row) => sum + row.amountPaid, 0),
    outstanding: accounts.reduce((sum, row) => sum + row.balance, 0),
    studentsPaid: accounts.filter((row) => row.status === 'paid').length,
    studentsUnpaid: accounts.filter((row) => row.status === 'unpaid').length,
    studentsPartial: accounts.filter((row) => row.status === 'partial').length,
  };

  const collectionRate =
    summaryFromAccounts.expected > 0
      ? roundRate((summaryFromAccounts.collected / summaryFromAccounts.expected) * 100)
      : 0;

  const useGlobalSummary = !classId && !query.studentId && !query.paymentStatus && !query.search;
  const globalSummary = useGlobalSummary ? await computeMonthlyFeeSummary(month, year) : null;

  const summary = globalSummary
    ? {
        expected: globalSummary.totalExpected,
        collected: globalSummary.totalCollected,
        outstanding: globalSummary.totalOutstanding,
        collectionRate: globalSummary.collectionPercentage,
        studentsPaid: globalSummary.studentsPaid,
        studentsUnpaid: globalSummary.studentsUnpaid,
        studentsPartial: globalSummary.studentsPartial,
      }
    : { ...summaryFromAccounts, collectionRate };

  const trend = await computeMonthlyFeeTrend(month, year, 6);
  const trendChart = trend.map((point) => ({
    monthLabel: point.monthLabel,
    collected: point.collected,
    outstanding: point.outstanding,
    expected: point.expected,
  }));

  const paymentFilter: Record<string, unknown> = { month, year };
  if (query.studentId) paymentFilter.studentId = parseObjectId(query.studentId, 'student id');
  if (classId) {
    const studentIds = await resolveStudentObjectIds({ classId });
    if (studentIds) paymentFilter.studentId = { $in: studentIds };
  }
  if (query.dateFrom || query.dateTo) {
    paymentFilter.paymentDate = {
      ...(query.dateFrom ? { $gte: startOfDay(query.dateFrom) } : {}),
      ...(query.dateTo ? { $lte: endOfDay(query.dateTo) } : {}),
    };
  }

  const classFeeMap = await buildActiveClassFeeMap();
  const accountStatusByStudent = new Map(accounts.map((row) => [row.studentId, row.status]));

  const skip = (query.page - 1) * query.limit;
  const [paymentTotal, payments] = await Promise.all([
    PaymentModel.countDocuments(paymentFilter),
    PaymentModel.find(paymentFilter)
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(query.limit)
      .populate({ path: 'studentId', select: 'fullName admissionNumber classId' })
      .lean(),
  ]);

  let paymentItems = payments.map((payment) => {
    const student = payment.studentId as {
      _id: Types.ObjectId;
      fullName?: string;
      admissionNumber?: string;
      classId?: Types.ObjectId;
    } | null;
    const studentKey = student?._id.toString() ?? '';
    const classInfo = student?.classId ? resolveFeeForClass(classFeeMap, student.classId) : null;
    const status: StudentFeeStatus =
      accountStatusByStudent.get(studentKey) ??
      resolveStudentFeeStatus(classInfo?.monthlyFee ?? 0, payment.amount);

    return {
      id: payment._id.toString(),
      studentId: studentKey,
      studentName: student?.fullName ?? 'Unknown student',
      displayId: student?._id ? buildDisplayId({ _id: student._id, admissionNumber: student.admissionNumber }) : '—',
      program: classInfo?.className ?? '—',
      month: payment.month,
      year: payment.year,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      mpesaReference: payment.mpesaReference ?? '—',
      paymentDate: payment.paymentDate.toISOString(),
      status,
    };
  });

  if (query.paymentStatus) {
    paymentItems = paymentItems.filter((item) => item.status === query.paymentStatus);
  }

  if (query.search) {
    const term = query.search.toLowerCase();
    paymentItems = paymentItems.filter(
      (item) =>
        item.studentName.toLowerCase().includes(term) ||
        item.displayId.toLowerCase().includes(term) ||
        item.mpesaReference.toLowerCase().includes(term),
    );
  }

  return {
    period: { month, year, dateFrom: dateRange.from.toISOString(), dateTo: dateRange.to.toISOString() },
    summary,
    trend: trendChart,
    accounts: accounts.slice(0, query.limit),
    payments: paymentItems,
    pagination: {
      page: query.page,
      limit: query.limit,
      total: paymentTotal,
      totalPages: Math.max(1, Math.ceil(paymentTotal / query.limit)),
    } satisfies Pagination,
  };
}

export async function getQuranReport(query: ReportQuranQuery) {
  const dateRange = resolveDateRange(query);
  const classId = await resolveClassIdForQuery(query);
  const studentIds = await resolveStudentObjectIds({ classId, studentId: query.studentId });

  const match: Record<string, unknown> = {
    date: { $gte: dateRange.from, $lte: dateRange.to },
  };
  if (query.type) match.type = query.type;
  if (query.surahNumber) match.surahNumber = query.surahNumber;
  if (studentIds) match.studentId = { $in: studentIds };

  if (query.search) {
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    const matchingStudents = await StudentModel.find({
      $or: [{ fullName: regex }, { admissionNumber: regex }],
    })
      .select('_id')
      .lean();
    const ids = matchingStudents.map((student) => student._id);
    match.$or = [{ studentId: { $in: ids } }, { surahName: regex }];
  }

  const [totalLessons, sabaqCount, murajaahCount, studentsWithLessons] = await Promise.all([
    QuranLessonRecordModel.countDocuments(match),
    QuranLessonRecordModel.countDocuments({ ...match, type: QuranLessonType.SABAQ }),
    QuranLessonRecordModel.countDocuments({ ...match, type: QuranLessonType.MURAJAAH }),
    QuranLessonRecordModel.distinct('studentId', match).then((ids) => ids.length),
  ]);

  const activityByDate = await QuranLessonRecordModel.aggregate<{ _id: string; count: number }>([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const classFeeMap = await buildActiveClassFeeMap();

  const skip = (query.page - 1) * query.limit;
  const [total, records] = await Promise.all([
    QuranLessonRecordModel.countDocuments(match),
    QuranLessonRecordModel.find(match).sort({ date: -1, createdAt: -1 }).skip(skip).limit(query.limit).lean(),
  ]);

  const studentIdList = records.map((record) => record.studentId);
  const students = await StudentModel.find({ _id: { $in: studentIdList } }).lean();
  const studentMap = new Map(
    students.map((student) => [
      student._id.toString(),
      {
        fullName: student.fullName,
        displayId: buildDisplayId(student),
        program: resolveFeeForClass(classFeeMap, student.classId).className,
      },
    ]),
  );

  const items = records.map((record) => {
    const studentInfo = studentMap.get(record.studentId.toString());
    return {
      id: record._id.toString(),
      date: record.date.toISOString(),
      studentId: record.studentId.toString(),
      studentName: studentInfo?.fullName ?? 'Unknown student',
      displayId: studentInfo?.displayId ?? '—',
      program: studentInfo?.program ?? '—',
      type: record.type,
      surahName: record.surahName,
      surahNumber: record.surahNumber,
      fromAyah: record.fromAyah,
      toAyah: record.toAyah,
      juz: record.juz ?? null,
      pageFrom: record.pageFrom ?? null,
      pageTo: record.pageTo ?? null,
      teacherAssessment: record.teacherAssessment,
      teacherNotes: record.teacherNotes ?? null,
    };
  });

  const activityByStudent = await QuranLessonRecordModel.aggregate<{ _id: Types.ObjectId; count: number }>([
    { $match: match },
    { $group: { _id: '$studentId', count: { $sum: 1 } } },
  ]);

  const activityStudentDocs = await StudentModel.find({
    _id: { $in: activityByStudent.map((row) => row._id) },
  }).lean();

  const programCounts = new Map<string, number>();
  for (const row of activityByStudent) {
    const student = activityStudentDocs.find((doc) => doc._id.equals(row._id));
    if (!student) continue;
    const program = resolveFeeForClass(classFeeMap, student.classId).className;
    programCounts.set(program, (programCounts.get(program) ?? 0) + row.count);
  }

  return {
    period: { dateFrom: dateRange.from.toISOString(), dateTo: dateRange.to.toISOString() },
    summary: {
      totalLessons,
      sabaqCount,
      murajaahCount,
      studentsWithLessons,
    },
    activityByDate: activityByDate.map((row) => ({ date: row._id, count: row.count })),
    activityByProgram: [...programCounts.entries()].map(([program, count]) => ({ program, count })),
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    } satisfies Pagination,
  };
}
