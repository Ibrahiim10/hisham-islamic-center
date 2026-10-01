export type FeeStatus = 'paid' | 'partial' | 'unpaid' | 'overdue';

export type StudentRecord = {
  id: string;
  regNo: string;
  fullName: string;
  gender: 'male' | 'female';
  className: string;
  parentPhone: string;
  quranProgress: string;
  feeStatus: FeeStatus;
  status: 'active' | 'inactive';
};

export type PaymentRecord = {
  id: string;
  studentName: string;
  regNo: string;
  className: string;
  amount: number;
  method: 'M-PESA' | 'BANK';
  reference: string;
  dateLabel: string;
  status: 'verified' | 'partial' | 'pending';
};

export type AttendanceStudent = {
  id: string;
  fullName: string;
  regNo: string;
  status: 'present' | 'absent' | null;
};
