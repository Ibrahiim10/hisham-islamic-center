import { Schema, model, type HydratedDocument, type InferSchemaType, type Types } from 'mongoose';
import { Gender, StudentStatus } from '../types/enums.js';

const studentSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
    },
    parentPhone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    studentType: {
      type: String,
      required: true,
      trim: true,
      default: 'regular',
    },
    admissionDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(StudentStatus),
      default: StudentStatus.ACTIVE,
      required: true,
      index: true,
    },
    admissionNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
    deactivatedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

studentSchema.index({ fullName: 'text' });
studentSchema.index({ status: 1, classId: 1 });

export type Student = InferSchemaType<typeof studentSchema> & {
  classId: Types.ObjectId;
};
export type StudentDocument = HydratedDocument<Student>;

export const StudentModel = model('Student', studentSchema);
