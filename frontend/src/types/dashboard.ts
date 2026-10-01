export type DashboardOverview = {
  students: {
    total: number;
    tahfidh: number;
    farbar: number;
    women: number;
  };
  attendance: {
    date: string;
    present: number;
    absent: number;
    presentRate: number;
    absenceRate: number;
    markedCount: number;
    unmarkedCount: number;
  };
  fees: {
    month: number;
    year: number;
    monthKey: string;
    monthLabel: string;
    expected: number;
    collected: number;
    outstanding: number;
    collectionRate: number;
    unpaidAccounts: number;
    studentsPaid: number;
    studentsPartial: number;
    studentsUnpaid: number;
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
  feeMonthlyTrend: Array<{
    month: number;
    year: number;
    monthKey: string;
    monthLabel: string;
    expected: number;
    collected: number;
    outstanding: number;
  }>;
  weeklyAttendance: Array<{
    day: string;
    date: string;
    presentRate: number;
    isToday: boolean;
    isFuture: boolean;
  }>;
  recentPayments: Array<{
    id: string;
    studentName: string;
    displayId: string;
    className: string;
    amount: number;
    method: string;
    reference: string;
    paymentDate: string;
    month: number;
    year: number;
  }>;
};
