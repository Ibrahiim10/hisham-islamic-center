import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';
import { Gender } from '../types/enums.js';

const admissionApplicationSchema = new Schema(
  {
    studentFullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: Object.values(Gender), required: true },
    age: { type: Number, required: true, min: 0, max: 120 },
    parentGuardianName: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    residentialAddress: { type: String, required: true, trim: true },
    programStream: {
      type: String,
      required: true,
      enum: [
        'regular_tahfidh',
        'school_weekend',
        'school_weekday_evening',
        'womens_section',
      ],
    },
    paymentPreference: {
      type: String,
      required: true,
      enum: ['cash', 'mpesa'],
    },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
);

admissionApplicationSchema.index({ createdAt: -1 });

export type AdmissionApplication = InferSchemaType<typeof admissionApplicationSchema>;
export type AdmissionApplicationDocument = HydratedDocument<AdmissionApplication>;

export const AdmissionApplicationModel = model('AdmissionApplication', admissionApplicationSchema);
