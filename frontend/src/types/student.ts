export type StudentListItem = {
  id: string;
  admissionNumber: string | null;
  displayId: string;
  fullName: string;
  gender: 'male' | 'female';
  classId: string;
  className: string;
  parentPhone: string;
  monthlyFee: number;
  currency: string;
  status: 'active' | 'inactive';
};

export type StudentDetail = StudentListItem & {
  dateOfBirth: string;
  address: string;
  studentType: string;
  admissionDate: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentClassOption = {
  id: string;
  name: string;
  monthlyFee: number;
  currency: string;
};

export type StudentsListResponse = {
  items: StudentListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    total: number;
    byClass: Record<string, number>;
  };
};

export type StudentFormValues = {
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | '';
  parentPhone: string;
  address: string;
  classId: string;
};
