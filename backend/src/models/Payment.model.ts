import { Schema, model, type HydratedDocument, type InferSchemaType, type Types } from 'mongoose';
import { PaymentMethod } from '../types/enums.js';

const paymentSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
      default: PaymentMethod.MPESA,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    mpesaReference: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

paymentSchema.index({ studentId: 1, year: -1, month: -1 });

export type Payment = InferSchemaType<typeof paymentSchema> & {
  studentId: Types.ObjectId;
  recordedBy: Types.ObjectId;
};
export type PaymentDocument = HydratedDocument<Payment>;

export const PaymentModel = model('Payment', paymentSchema);
