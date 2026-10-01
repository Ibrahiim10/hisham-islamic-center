export type FeeClassConfig = {
  classId: string;
  className: string;
  monthlyFee: number;
  currency: string;
};

export type FeeSummary = {
  month: number;
  year: number;
  monthKey: string;
  monthLabel: string;
  totalExpected: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionPercentage: number;
  studentsPaid: number;
  studentsPartial: number;
  studentsUnpaid: number;
  unpaidAccounts: number;
  byClass: Array<{
    classKey: string;
    className: string;
    studentCount: number;
    expected: number;
    collected: number;
    outstanding: number;
    collectionRate: number;
  }>;
};

export type FeeAccountRow = {
  studentId: string;
  fullName: string;
  displayId: string;
  classId: string;
  className: string;
  monthlyFee: number;
  amountPaid: number;
  balance: number;
  month: number;
  year: number;
  status: 'paid' | 'partial' | 'unpaid';
};

export type FeePaymentRecord = {
  id: string;
  studentId: string;
  studentName: string;
  displayId: string;
  className: string;
  month: number;
  year: number;
  monthLabel: string;
  amount: number;
  paymentMethod: string;
  mpesaReference: string;
  paymentDate: string;
  recordedAt: string;
};

export type RecordPaymentPayload = {
  studentId: string;
  month: number;
  year: number;
  amount: number;
  mpesaReference: string;
  paymentDate: string;
  notes?: string;
};

export type FeeMonthlyTrendPoint = {
  month: number;
  year: number;
  monthKey: string;
  monthLabel: string;
  expected: number;
  collected: number;
  outstanding: number;
};
