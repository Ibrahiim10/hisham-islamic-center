import { Schema, model, type HydratedDocument, type InferSchemaType, type Types } from 'mongoose';
import { NotificationChannel, NotificationStatus } from '../types/enums.js';

const notificationSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    parentPhone: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    channel: {
      type: String,
      enum: Object.values(NotificationChannel),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.PENDING,
      required: true,
      index: true,
    },
    sentAt: {
      type: Date,
    },
    providerMessageId: {
      type: String,
      trim: true,
    },
    errorMessage: {
      type: String,
      trim: true,
    },
    dedupeKey: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true },
);

export type Notification = InferSchemaType<typeof notificationSchema> & {
  studentId: Types.ObjectId;
};
export type NotificationDocument = HydratedDocument<Notification>;

export const NotificationModel = model('Notification', notificationSchema);
