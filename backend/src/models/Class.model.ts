import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const classSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

export type ClassSection = InferSchemaType<typeof classSchema>;
export type ClassSectionDocument = HydratedDocument<ClassSection>;

export const ClassModel = model('Class', classSchema);
