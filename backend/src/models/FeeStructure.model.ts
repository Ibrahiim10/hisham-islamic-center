import { Schema, model, type HydratedDocument, type InferSchemaType, type Types } from 'mongoose';

const feeStructureSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'KES',
      trim: true,
    },
    effectiveFrom: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

feeStructureSchema.index({ classId: 1, isActive: 1, effectiveFrom: -1 });

export type FeeStructure = InferSchemaType<typeof feeStructureSchema> & {
  classId: Types.ObjectId;
};
export type FeeStructureDocument = HydratedDocument<FeeStructure>;

export const FeeStructureModel = model('FeeStructure', feeStructureSchema);
