import type { Types } from 'mongoose';
import { CLASS_MONTHLY_FEE_KES } from '../constants/classFees.js';
import { ClassModel } from '../models/Class.model.js';
import { FeeStructureModel } from '../models/FeeStructure.model.js';

export type ClassFeeInfo = {
  classId: string;
  className: string;
  monthlyFee: number;
  currency: string;
};

export async function buildActiveClassFeeMap(): Promise<Map<string, ClassFeeInfo>> {
  const classes = await ClassModel.find({ isActive: true }).lean();
  const classIds = classes.map((doc) => doc._id);

  const feeStructures = await FeeStructureModel.find({
    classId: { $in: classIds },
    isActive: true,
  })
    .sort({ effectiveFrom: -1 })
    .lean();

  const feeByClassId = new Map<string, number>();
  for (const fee of feeStructures) {
    const key = fee.classId.toString();
    if (!feeByClassId.has(key)) {
      feeByClassId.set(key, fee.amount);
    }
  }

  const map = new Map<string, ClassFeeInfo>();
  for (const classDoc of classes) {
    const classId = classDoc._id.toString();
    const fallback = CLASS_MONTHLY_FEE_KES[classDoc.name] ?? 0;
    map.set(classId, {
      classId,
      className: classDoc.name,
      monthlyFee: feeByClassId.get(classId) ?? fallback,
      currency: 'KES',
    });
  }
  return map;
}

export function resolveFeeForClass(classFeeMap: Map<string, ClassFeeInfo>, classId: Types.ObjectId | string): ClassFeeInfo {
  const key = classId.toString();
  const match = classFeeMap.get(key);
  if (match) return match;
  return {
    classId: key,
    className: 'Unknown',
    monthlyFee: 0,
    currency: 'KES',
  };
}
