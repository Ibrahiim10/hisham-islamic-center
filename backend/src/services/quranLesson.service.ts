import { Types } from 'mongoose';
import { getSurahByNumber, SURAH_LIST } from '../constants/surahs.js';
import { ClassModel } from '../models/Class.model.js';
import { QuranLessonRecordModel, type QuranLessonRecordDocument } from '../models/QuranLessonRecord.model.js';
import { StudentModel } from '../models/Student.model.js';
import { QuranLessonType, StudentStatus } from '../types/enums.js';
import { ApiError } from '../utils/apiError.js';
import { parseObjectId } from '../utils/objectId.js';
import type { CreateQuranLessonBody, UpdateQuranLessonBody } from '../validators/quran.validators.js';

export type QuranLessonDto = {
  id: string;
  studentId: string;
  studentName: string;
  displayId: string;
  className: string;
  date: string;
  type: string;
  surahNumber: number;
  surahName: string;
  fromAyah: number;
  toAyah: number;
  juz: number | null;
  pageFrom: number | null;
  pageTo: number | null;
  teacherAssessment: string;
  teacherNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type QuranStudentSummary = {
  studentId: string;
  studentName: string;
  displayId: string;
  className: string;
  sabaqSessions: number;
  murajaahSessions: number;
  pagesRecorded: number;
  lastLessonDate: string | null;
  lastSabaqDate: string | null;
  lastMurajaahDate: string | null;
  latestAssessment: string | null;
  latestTeacherNotes: string | null;
  currentSabaq: QuranLessonDto | null;
  recentSabaq: QuranLessonDto[];
  recentMurajaah: QuranLessonDto[];
  history: QuranLessonDto[];
};

export type QuranModuleStats = {
  totalLessons: number;
  sabaqCount: number;
  murajaahCount: number;
  studentsWithLessons: number;
  lessonsToday: number;
};

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

function buildDisplayId(student: { _id: Types.ObjectId; admissionNumber?: string | null }): string {
  if (student.admissionNumber) return student.admissionNumber;
  return `STU-${student._id.toString().slice(-8).toUpperCase()}`;
}

function countPagesInRecord(record: { pageFrom?: number | null; pageTo?: number | null }): number {
  if (record.pageFrom == null || record.pageTo == null) return 0;
  return Math.max(0, record.pageTo - record.pageFrom + 1);
}

async function mapLessonRecord(
  record: QuranLessonRecordDocument,
  studentMap: Map<string, { fullName: string; displayId: string; className: string }>,
): Promise<QuranLessonDto> {
  const studentKey = record.studentId.toString();
  const studentInfo = studentMap.get(studentKey);
  return {
    id: record._id.toString(),
    studentId: studentKey,
    studentName: studentInfo?.fullName ?? 'Unknown student',
    displayId: studentInfo?.displayId ?? '—',
    className: studentInfo?.className ?? '—',
    date: record.date.toISOString(),
    type: record.type,
    surahNumber: record.surahNumber,
    surahName: record.surahName,
    fromAyah: record.fromAyah,
    toAyah: record.toAyah,
    juz: record.juz ?? null,
    pageFrom: record.pageFrom ?? null,
    pageTo: record.pageTo ?? null,
    teacherAssessment: record.teacherAssessment,
    teacherNotes: record.teacherNotes ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

async function buildStudentMap(studentIds: Types.ObjectId[]): Promise<Map<string, { fullName: string; displayId: string; className: string }>> {
  const uniqueIds = [...new Set(studentIds.map((id) => id.toString()))].map((id) => parseObjectId(id, 'student id'));
  const students = await StudentModel.find({ _id: { $in: uniqueIds } }).lean();
  const classIds = students.map((student) => student.classId);
  const classes = await ClassModel.find({ _id: { $in: classIds } }).lean();
  const classNameById = new Map(classes.map((classDoc) => [classDoc._id.toString(), classDoc.name]));

  const map = new Map<string, { fullName: string; displayId: string; className: string }>();
  for (const student of students) {
    map.set(student._id.toString(), {
      fullName: student.fullName,
      displayId: buildDisplayId(student),
      className: classNameById.get(student.classId.toString()) ?? '—',
    });
  }
  return map;
}

export function listSurahs() {
  return SURAH_LIST;
}

export async function getQuranModuleStats(): Promise<QuranModuleStats> {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const [totalLessons, sabaqCount, murajaahCount, studentsWithLessons, lessonsToday] = await Promise.all([
    QuranLessonRecordModel.countDocuments(),
    QuranLessonRecordModel.countDocuments({ type: QuranLessonType.SABAQ }),
    QuranLessonRecordModel.countDocuments({ type: QuranLessonType.MURAJAAH }),
    QuranLessonRecordModel.distinct('studentId').then((ids) => ids.length),
    QuranLessonRecordModel.countDocuments({ date: { $gte: todayStart, $lte: todayEnd } }),
  ]);

  return { totalLessons, sabaqCount, murajaahCount, studentsWithLessons, lessonsToday };
}

export async function listQuranLessons(params: {
  search?: string;
  type?: string;
  studentId?: string;
  surahNumber?: number;
  dateFrom?: Date;
  dateTo?: Date;
  page: number;
  limit: number;
}): Promise<{ items: QuranLessonDto[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const filter: Record<string, unknown> = {};

  if (params.type) filter.type = params.type;
  if (params.surahNumber) filter.surahNumber = params.surahNumber;
  if (params.studentId) filter.studentId = parseObjectId(params.studentId, 'student id');

  if (params.dateFrom || params.dateTo) {
    filter.date = {
      ...(params.dateFrom ? { $gte: startOfDay(params.dateFrom) } : {}),
      ...(params.dateTo ? { $lte: endOfDay(params.dateTo) } : {}),
    };
  }

  if (params.search) {
    const escaped = params.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    const matchingStudents = await StudentModel.find({
      status: StudentStatus.ACTIVE,
      $or: [{ fullName: regex }, { admissionNumber: regex }],
    })
      .select('_id')
      .lean();
    const studentIds = matchingStudents.map((student) => student._id);
    filter.$or = [{ studentId: { $in: studentIds } }, { surahName: regex }];
  }

  const skip = (params.page - 1) * params.limit;
  const [total, records] = await Promise.all([
    QuranLessonRecordModel.countDocuments(filter),
    QuranLessonRecordModel.find(filter).sort({ date: -1, createdAt: -1 }).skip(skip).limit(params.limit),
  ]);

  const studentMap = await buildStudentMap(records.map((record) => record.studentId));
  const items = await Promise.all(records.map((record) => mapLessonRecord(record, studentMap)));

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

export async function getQuranLessonById(id: string): Promise<QuranLessonDto> {
  const record = await QuranLessonRecordModel.findById(parseObjectId(id, 'record id'));
  if (!record) throw new ApiError(404, 'Qur\'an learning record not found');
  const studentMap = await buildStudentMap([record.studentId]);
  return mapLessonRecord(record, studentMap);
}

async function assertActiveStudent(studentId: string) {
  const student = await StudentModel.findById(parseObjectId(studentId, 'student id'));
  if (!student) throw new ApiError(404, 'Student not found');
  return student;
}

function applySurahName(body: CreateQuranLessonBody | UpdateQuranLessonBody) {
  const surah = getSurahByNumber(body.surahNumber);
  if (!surah) throw new ApiError(400, 'Invalid Surah number');
  return surah.name;
}

export async function createQuranLesson(body: CreateQuranLessonBody, recordedByUserId: string): Promise<QuranLessonDto> {
  await assertActiveStudent(body.studentId);
  const surahName = applySurahName(body);

  const record = await QuranLessonRecordModel.create({
    studentId: parseObjectId(body.studentId, 'student id'),
    date: body.date,
    type: body.type,
    surahNumber: body.surahNumber,
    surahName,
    fromAyah: body.fromAyah,
    toAyah: body.toAyah,
    juz: body.juz,
    pageFrom: body.pageFrom,
    pageTo: body.pageTo,
    teacherAssessment: body.teacherAssessment,
    teacherNotes: body.teacherNotes,
    recordedBy: parseObjectId(recordedByUserId, 'user id'),
  });

  const studentMap = await buildStudentMap([record.studentId]);
  return mapLessonRecord(record, studentMap);
}

export async function updateQuranLesson(id: string, body: UpdateQuranLessonBody): Promise<QuranLessonDto> {
  await assertActiveStudent(body.studentId);
  const record = await QuranLessonRecordModel.findById(parseObjectId(id, 'record id'));
  if (!record) throw new ApiError(404, 'Qur\'an learning record not found');

  record.studentId = parseObjectId(body.studentId, 'student id');
  record.date = body.date;
  record.type = body.type;
  record.surahNumber = body.surahNumber;
  record.surahName = applySurahName(body);
  record.fromAyah = body.fromAyah;
  record.toAyah = body.toAyah;
  record.juz = body.juz;
  record.pageFrom = body.pageFrom;
  record.pageTo = body.pageTo;
  record.teacherAssessment = body.teacherAssessment;
  record.teacherNotes = body.teacherNotes;

  await record.save();
  const studentMap = await buildStudentMap([record.studentId]);
  return mapLessonRecord(record, studentMap);
}

export async function deleteQuranLesson(id: string): Promise<void> {
  const deleted = await QuranLessonRecordModel.findByIdAndDelete(parseObjectId(id, 'record id'));
  if (!deleted) throw new ApiError(404, 'Qur\'an learning record not found');
}

export async function getStudentQuranSummary(studentId: string): Promise<QuranStudentSummary> {
  const student = await assertActiveStudent(studentId);
  const studentMap = await buildStudentMap([student._id]);
  const studentInfo = studentMap.get(student._id.toString());

  const records = await QuranLessonRecordModel.find({ studentId: student._id }).sort({ date: -1, createdAt: -1 });
  const history = await Promise.all(records.map((record) => mapLessonRecord(record, studentMap)));

  const sabaqRecords = history.filter((record) => record.type === QuranLessonType.SABAQ);
  const murajaahRecords = history.filter((record) => record.type === QuranLessonType.MURAJAAH);
  const pagesRecorded = records.reduce((sum, record) => sum + countPagesInRecord(record), 0);

  const latest = history[0] ?? null;

  return {
    studentId: student._id.toString(),
    studentName: studentInfo?.fullName ?? student.fullName,
    displayId: studentInfo?.displayId ?? buildDisplayId(student),
    className: studentInfo?.className ?? '—',
    sabaqSessions: sabaqRecords.length,
    murajaahSessions: murajaahRecords.length,
    pagesRecorded,
    lastLessonDate: latest?.date ?? null,
    lastSabaqDate: sabaqRecords[0]?.date ?? null,
    lastMurajaahDate: murajaahRecords[0]?.date ?? null,
    latestAssessment: latest?.teacherAssessment ?? null,
    latestTeacherNotes: latest?.teacherNotes ?? null,
    currentSabaq: sabaqRecords[0] ?? null,
    recentSabaq: sabaqRecords.slice(0, 5),
    recentMurajaah: murajaahRecords.slice(0, 5),
    history,
  };
}
