import { Types } from 'mongoose';
import { CLASS_MONTHLY_FEE_KES } from '../constants/classFees.js';
import { ClassModel } from '../models/Class.model.js';
import { FeeStructureModel } from '../models/FeeStructure.model.js';
import { StudentModel, type StudentDocument } from '../models/Student.model.js';
import { StudentStatus } from '../types/enums.js';
import { ApiError } from '../utils/apiError.js';
import { parseObjectId } from '../utils/objectId.js';
import type { CreateStudentBody, ListStudentsQuery, UpdateStudentBody } from '../validators/student.validators.js';

export type StudentClassInfo = {
  id: string;
  name: string;
  monthlyFee: number;
  currency: string;
};

export type StudentListItem = {
  id: string;
  admissionNumber: string | null;
  displayId: string;
  fullName: string;
  gender: string;
  classId: string;
  className: string;
  parentPhone: string;
  monthlyFee: number;
  currency: string;
  status: string;
};

export type StudentDetail = StudentListItem & {
  dateOfBirth: string;
  address: string;
  studentType: string;
  admissionDate: string;
  createdAt: string;
  updatedAt: string;
};

function buildDisplayId(student: StudentDocument): string {
  if (student.admissionNumber) {
    return student.admissionNumber;
  }
  return `STU-${student._id.toString().slice(-8).toUpperCase()}`;
}

async function resolveMonthlyFee(classId: Types.ObjectId, className: string): Promise<{ amount: number; currency: string }> {
  const feeStructure = await FeeStructureModel.findOne({ classId, isActive: true })
    .sort({ effectiveFrom: -1 })
    .lean();

  if (feeStructure) {
    return { amount: feeStructure.amount, currency: feeStructure.currency };
  }

  const fallback = CLASS_MONTHLY_FEE_KES[className];
  return { amount: fallback ?? 0, currency: 'KES' };
}

async function mapStudentDocument(student: StudentDocument): Promise<StudentDetail> {
  const classDoc = await ClassModel.findById(student.classId).lean();
  const className = classDoc?.name ?? 'Unknown';
  const fee = await resolveMonthlyFee(student.classId, className);

  return {
    id: student._id.toString(),
    admissionNumber: student.admissionNumber ?? null,
    displayId: buildDisplayId(student),
    fullName: student.fullName,
    dateOfBirth: student.dateOfBirth.toISOString(),
    gender: student.gender,
    parentPhone: student.parentPhone,
    address: student.address,
    classId: student.classId.toString(),
    className,
    monthlyFee: fee.amount,
    currency: fee.currency,
    studentType: student.studentType,
    admissionDate: student.admissionDate.toISOString(),
    status: student.status,
    createdAt: student.createdAt.toISOString(),
    updatedAt: student.updatedAt.toISOString(),
  };
}

async function mapStudentListItem(student: StudentDocument, className: string, fee: { amount: number; currency: string }): Promise<StudentListItem> {
  return {
    id: student._id.toString(),
    admissionNumber: student.admissionNumber ?? null,
    displayId: buildDisplayId(student),
    fullName: student.fullName,
    gender: student.gender,
    classId: student.classId.toString(),
    className,
    parentPhone: student.parentPhone,
    monthlyFee: fee.amount,
    currency: fee.currency,
    status: student.status,
  };
}

async function generateAdmissionNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `HIC-${year}-`;

  const lastStudent = await StudentModel.findOne({
    admissionNumber: { $regex: `^${prefix}` },
  })
    .sort({ admissionNumber: -1 })
    .select('admissionNumber')
    .lean();

  let sequence = 1;
  if (lastStudent?.admissionNumber) {
    const suffix = lastStudent.admissionNumber.slice(prefix.length);
    const parsed = Number.parseInt(suffix, 10);
    if (!Number.isNaN(parsed)) {
      sequence = parsed + 1;
    }
  }

  return `${prefix}${String(sequence).padStart(4, '0')}`;
}

async function assertClassExists(classId: string): Promise<{ _id: Types.ObjectId; name: string }> {
  const objectId = parseObjectId(classId, 'class id');
  const classDoc = await ClassModel.findById(objectId).lean();
  if (!classDoc || !classDoc.isActive) {
    throw new ApiError(400, 'Selected program/class is not available');
  }
  return { _id: classDoc._id, name: classDoc.name };
}

function buildSearchFilter(search: string | undefined): Record<string, unknown> {
  if (!search) {
    return {};
  }

  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'i');

  return {
    $or: [{ fullName: regex }, { parentPhone: regex }, { admissionNumber: regex }],
  };
}

export async function listStudentClasses(): Promise<StudentClassInfo[]> {
  const classes = await ClassModel.find({ isActive: true }).sort({ name: 1 }).lean();

  return Promise.all(
    classes.map(async (classDoc) => {
      const fee = await resolveMonthlyFee(classDoc._id, classDoc.name);
      return {
        id: classDoc._id.toString(),
        name: classDoc.name,
        monthlyFee: fee.amount,
        currency: fee.currency,
      };
    }),
  );
}

export async function listStudents(query: ListStudentsQuery): Promise<{
  items: StudentListItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  summary: { total: number; byClass: Record<string, number> };
}> {
  const filter: Record<string, unknown> = {
    ...buildSearchFilter(query.search),
  };

  if (query.classId) {
    filter.classId = parseObjectId(query.classId, 'class id');
  }
  if (query.status) {
    filter.status = query.status;
  }

  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;

  const [total, students, classDocs] = await Promise.all([
    StudentModel.countDocuments(filter),
    StudentModel.find(filter).sort({ fullName: 1 }).skip(skip).limit(limit),
    ClassModel.find().lean(),
  ]);

  const classNameById = new Map(classDocs.map((doc) => [doc._id.toString(), doc.name]));

  const items = await Promise.all(
    students.map(async (student) => {
      const className = classNameById.get(student.classId.toString()) ?? 'Unknown';
      const fee = await resolveMonthlyFee(student.classId, className);
      return mapStudentListItem(student, className, fee);
    }),
  );

  const [summaryTotal, summaryAgg] = await Promise.all([
    StudentModel.countDocuments(filter),
    StudentModel.aggregate<{ _id: Types.ObjectId; count: number }>([
      { $match: filter },
      { $group: { _id: '$classId', count: { $sum: 1 } } },
    ]),
  ]);

  const byClass: Record<string, number> = {};
  for (const row of summaryAgg) {
    const name = classNameById.get(row._id.toString()) ?? 'Unknown';
    byClass[name] = row.count;
  }

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
    summary: {
      total: summaryTotal,
      byClass,
    },
  };
}

export async function getStudentById(id: string): Promise<StudentDetail> {
  const student = await StudentModel.findById(parseObjectId(id, 'student id'));
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  return mapStudentDocument(student);
}

export async function createStudent(body: CreateStudentBody): Promise<StudentDetail> {
  const classDoc = await assertClassExists(body.classId);
  const admissionNumber = await generateAdmissionNumber();

  const student = await StudentModel.create({
    fullName: body.fullName,
    dateOfBirth: body.dateOfBirth,
    gender: body.gender,
    parentPhone: body.parentPhone,
    address: body.address,
    classId: classDoc._id,
    studentType: 'regular',
    admissionDate: new Date(),
    status: StudentStatus.ACTIVE,
    admissionNumber,
  });

  return mapStudentDocument(student);
}

export async function updateStudent(id: string, body: UpdateStudentBody): Promise<StudentDetail> {
  const classDoc = await assertClassExists(body.classId);
  const student = await StudentModel.findById(parseObjectId(id, 'student id'));
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  student.fullName = body.fullName;
  student.dateOfBirth = body.dateOfBirth;
  student.gender = body.gender;
  student.parentPhone = body.parentPhone;
  student.address = body.address;
  student.classId = classDoc._id;

  await student.save();
  return mapStudentDocument(student);
}
