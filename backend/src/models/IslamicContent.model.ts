import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';
import { IslamicContentType } from '../types/enums.js';

const islamicContentSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(IslamicContentType),
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    arabic: {
      type: String,
      required: true,
      trim: true,
    },
    translation: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    surah: {
      type: String,
      trim: true,
    },
    ayah: {
      type: Number,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

islamicContentSchema.index({ type: 1, isActive: 1 });

export type IslamicContent = InferSchemaType<typeof islamicContentSchema>;
export type IslamicContentDocument = HydratedDocument<IslamicContent>;

export const IslamicContentModel = model('IslamicContent', islamicContentSchema);
