export const StudentFeeStatus = {
  PAID: 'paid',
  PARTIAL: 'partial',
  UNPAID: 'unpaid',
} as const;

export type StudentFeeStatus = (typeof StudentFeeStatus)[keyof typeof StudentFeeStatus];

export function resolveStudentFeeStatus(expectedFee: number, amountPaid: number): StudentFeeStatus {
  if (amountPaid <= 0) {
    return StudentFeeStatus.UNPAID;
  }
  if (amountPaid >= expectedFee) {
    return StudentFeeStatus.PAID;
  }
  return StudentFeeStatus.PARTIAL;
}
