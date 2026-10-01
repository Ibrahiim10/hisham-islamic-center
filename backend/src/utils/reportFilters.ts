import { buildActiveClassFeeMap } from '../services/feeLookup.service.js';
import { parseObjectId } from './objectId.js';

export type ReportProgram = 'tahfidh' | 'farbar' | 'women';

const PROGRAM_CLASS_NAMES: Record<ReportProgram, string> = {
  tahfidh: 'Tahfidh',
  farbar: 'Farbar',
  women: 'Women Section',
};

export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function endOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

export function resolveMonthYear(params: { month?: number; year?: number }): { month: number; year: number } {
  const now = new Date();
  return {
    month: params.month ?? now.getMonth() + 1,
    year: params.year ?? now.getFullYear(),
  };
}

export function resolveDateRange(params: {
  dateFrom?: Date;
  dateTo?: Date;
  month?: number;
  year?: number;
}): { from: Date; to: Date } {
  if (params.dateFrom && params.dateTo) {
    const from = startOfDay(params.dateFrom);
    const to = endOfDay(params.dateTo);
    if (from > to) {
      return { from: to, to: from };
    }
    return { from, to };
  }

  const { month, year } = resolveMonthYear(params);
  const from = new Date(year, month - 1, 1);
  from.setHours(0, 0, 0, 0);
  const to = new Date(year, month, 0);
  to.setHours(23, 59, 59, 999);
  return { from, to };
}

export async function resolveClassIdFromReportFilters(params: {
  classId?: string;
  program?: ReportProgram;
}): Promise<string | undefined> {
  if (params.classId) {
    return parseObjectId(params.classId, 'class id').toString();
  }
  if (!params.program) return undefined;

  const classFeeMap = await buildActiveClassFeeMap();
  const targetName = PROGRAM_CLASS_NAMES[params.program];
  for (const info of classFeeMap.values()) {
    if (info.className === targetName) return info.classId;
  }
  return undefined;
}

export function roundRate(value: number): number {
  return Math.round(value * 10) / 10;
}
