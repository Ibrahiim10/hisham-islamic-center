import { Schema, model, type HydratedDocument, type InferSchemaType, type Types } from 'mongoose';

const quranLearningRecordSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      unique: true,
      index: true,
    },
    currentJuz: {
      type: Number,
      min: 1,
      max: 30,
    },
    currentSurah: {
      type: String,
      trim: true,
    },
    memorizationProgress: {
      type: String,
      trim: true,
    },
    revisionMurajaah: {
      type: String,
      trim: true,
    },
    dailyLesson: {
      type: String,
      trim: true,
    },
    islamicStudiesNotes: {
      type: String,
      trim: true,
    },
    hadithNotes: {
      type: String,
      trim: true,
    },
    arabicNotes: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export type QuranLearningRecord = InferSchemaType<typeof quranLearningRecordSchema> & {
  studentId: Types.ObjectId;
  lastUpdatedBy?: Types.ObjectId;
};
export type QuranLearningRecordDocument = HydratedDocument<QuranLearningRecord>;

export const QuranLearningRecordModel = model('QuranLearningRecord', quranLearningRecordSchema);
