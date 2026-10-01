import { Types } from 'mongoose';
import { PaymentModel } from '../models/Payment.model.js';
import { StudentModel } from '../models/Student.model.js';
import { PaymentMethod, StudentStatus } from '../types/enums.js';
import { ApiError } from '../utils/apiError.js';
import { parseObjectId } from '../utils/objectId.js';
import type { RecordPaymentBody } from '../validators/fee.validators.js';
import { buildActiveClassFeeMap, resolveFeeForClass } from './feeLookup.service.js';
import { getStudentFeeAccount } from './feeCalculation.service.js';

export type PaymentLedgerItem = {
  id: string;
  studentId: string;
  studentName: string;
  displayId: string;
  className: string;
  month: number;
  year: number;
  monthLabel: string;
  amount: number;
  paymentMethod: string;
  mpesaReference: string;
  paymentDate: string;
  recordedAt: string;
};

function buildDisplayId(student: { _id: unknown; admissionNumber?: string | null }): string {
  if (student.admissionNumber) return student.admissionNumber;
  return `STU-${String(student._id).slice(-8).toUpperCase()}`;
}

function buildMonthLabel(month: number, year: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString('en-KE', {
    month: 'long',
    year: 'numeric',
  });
}

export async function listFeePayments(params: {
  month?: number;
  year?: number;
  search?: string;
  classId?: string;
  studentId?: string;
  page: number;
  limit: number;
}): Promise<{ items: PaymentLedgerItem[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const filter: Record<string, unknown> = {};
  if (params.month) filter.month = params.month;
  if (params.year) filter.year = params.year;
  if (params.studentId) filter.studentId = parseObjectId(params.studentId, 'student id');

  const classFeeMap = await buildActiveClassFeeMap();

  let studentIdsFilter: Types.ObjectId[] | undefined;
  if (params.classId) {
    const classObjectId = parseObjectId(params.classId, 'class id');
    const students = await StudentModel.find({ classId: classObjectId, status: StudentStatus.ACTIVE })
      .select('_id')
      .lean();
    studentIdsFilter = students.map((student) => student._id);
    filter.studentId = { $in: studentIdsFilter };
  }

  const skip = (params.page - 1) * params.limit;
  const [total, payments] = await Promise.all([
    PaymentModel.countDocuments(filter),
    PaymentModel.find(filter)
      .sort({ paymentDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(params.limit)
      .populate({ path: 'studentId', select: 'fullName admissionNumber classId' })
      .lean(),
  ]);

  let items: PaymentLedgerItem[] = payments.map((payment) => {
    const student = payment.studentId as {
      _id: Types.ObjectId;
      fullName?: string;
      admissionNumber?: string;
      classId?: Types.ObjectId;
    } | null;
    const classInfo = student?.classId ? resolveFeeForClass(classFeeMap, student.classId) : null;
    return {
      id: payment._id.toString(),
      studentId: student?._id.toString() ?? '',
      studentName: student?.fullName ?? 'Unknown student',
      displayId: student ? buildDisplayId(student) : '—',
      className: classInfo?.className ?? '—',
      month: payment.month,
      year: payment.year,
      monthLabel: buildMonthLabel(payment.month, payment.year),
      amount: payment.amount,
      paymentMethod: payment.paymentMethod.toUpperCase(),
      mpesaReference: payment.mpesaReference ?? '—',
      paymentDate: payment.paymentDate.toISOString(),
      recordedAt: payment.createdAt.toISOString(),
    };
  });

  if (params.search) {
    const term = params.search.toLowerCase();
    items = items.filter(
      (item) =>
        item.studentName.toLowerCase().includes(term) ||
        item.displayId.toLowerCase().includes(term) ||
        item.mpesaReference.toLowerCase().includes(term),
    );
  }

  return {
    items,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    },
  };
}

export async function recordFeePayment(body: RecordPaymentBody, recordedByUserId: string): Promise<PaymentLedgerItem> {
  const studentObjectId = parseObjectId(body.studentId, 'student id');
  const student = await StudentModel.findById(studentObjectId);
  if (!student || student.status !== StudentStatus.ACTIVE) {
    throw new ApiError(400, 'Student not found or inactive');
  }

  const existingReference = await PaymentModel.findOne({ mpesaReference: body.mpesaReference }).lean();
  if (existingReference) {
    throw new ApiError(409, 'This M-Pesa reference has already been recorded');
  }

  const payment = await PaymentModel.create({
    studentId: student._id,
    month: body.month,
    year: body.year,
    amount: body.amount,
    paymentMethod: PaymentMethod.MPESA,
    paymentDate: body.paymentDate,
    mpesaReference: body.mpesaReference,
    recordedBy: parseObjectId(recordedByUserId, 'user id'),
    notes: body.notes,
  });

  const classFeeMap = await buildActiveClassFeeMap();
  const classInfo = resolveFeeForClass(classFeeMap, student.classId);

  return {
    id: payment._id.toString(),
    studentId: student._id.toString(),
    studentName: student.fullName,
    displayId: buildDisplayId(student),
    className: classInfo.className,
    month: payment.month,
    year: payment.year,
    monthLabel: buildMonthLabel(payment.month, payment.year),
    amount: payment.amount,
    paymentMethod: payment.paymentMethod.toUpperCase(),
    mpesaReference: payment.mpesaReference ?? '—',
    paymentDate: payment.paymentDate.toISOString(),
    recordedAt: payment.createdAt.toISOString(),
  };
}

export async function getStudentFeeDetails(studentId: string, month: number, year: number) {
  const account = await getStudentFeeAccount(studentId, month, year);
  if (!account) {
    throw new ApiError(404, 'Student fee account not found');
  }

  const payments = await PaymentModel.find({
    studentId: parseObjectId(studentId, 'student id'),
    month,
    year,
  })
    .sort({ paymentDate: -1 })
    .lean();

  return {
    account,
    payments: payments.map((payment) => ({
      id: payment._id.toString(),
      amount: payment.amount,
      mpesaReference: payment.mpesaReference ?? '—',
      paymentDate: payment.paymentDate.toISOString(),
      paymentMethod: payment.paymentMethod.toUpperCase(),
    })),
  };
}
