import { Schema, model, type HydratedDocument, type InferSchemaType, type Types } from 'mongoose';
import { QuranLessonType, TeacherAssessment } from '../types/enums.js';

const quranLessonRecordSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(QuranLessonType),
      required: true,
      index: true,
    },
    surahNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 114,
      index: true,
    },
    surahName: {
      type: String,
      required: true,
      trim: true,
    },
    fromAyah: {
      type: Number,
      required: true,
      min: 1,
    },
    toAyah: {
      type: Number,
      required: true,
      min: 1,
    },
    juz: {
      type: Number,
      min: 1,
      max: 30,
    },
    pageFrom: {
      type: Number,
      min: 1,
    },
    pageTo: {
      type: Number,
      min: 1,
    },
    teacherAssessment: {
      type: String,
      enum: Object.values(TeacherAssessment),
      required: true,
    },
    teacherNotes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

quranLessonRecordSchema.index({ studentId: 1, date: -1 });
quranLessonRecordSchema.index({ studentId: 1, type: 1, date: -1 });

export type QuranLessonRecord = InferSchemaType<typeof quranLessonRecordSchema> & {
  studentId: Types.ObjectId;
  recordedBy: Types.ObjectId;
};
export type QuranLessonRecordDocument = HydratedDocument<QuranLessonRecord>;

export const QuranLessonRecordModel = model('QuranLessonRecord', quranLessonRecordSchema);
