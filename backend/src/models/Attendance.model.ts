import { Schema, model, type HydratedDocument, type InferSchemaType, type Types } from 'mongoose';
import { AttendanceStatus } from '../types/enums.js';

const attendanceSchema = new Schema(
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
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      required: true,
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1, status: 1 });

export type Attendance = InferSchemaType<typeof attendanceSchema> & {
  studentId: Types.ObjectId;
  recordedBy?: Types.ObjectId;
};
export type AttendanceDocument = HydratedDocument<Attendance>;

export const AttendanceModel = model('Attendance', attendanceSchema);
