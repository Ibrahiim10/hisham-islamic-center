import { apiClient } from './apiClient';

export type AdmissionStream =
  | 'regular_tahfidh'
  | 'school_weekend'
  | 'school_weekday_evening'
  | 'womens_section';

export type AdmissionPayload = {
  studentFullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  age: number;
  parentGuardianName: string;
  contactPhone: string;
  email: string;
  residentialAddress: string;
  programStream: AdmissionStream;
  paymentPreference: 'cash' | 'mpesa';
  notes?: string;
};

export type ContactPayload = {
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

type PublicSubmitResponse = {
  success: boolean;
  message: string;
  data?: { id: string };
};

export async function submitAdmission(payload: AdmissionPayload): Promise<PublicSubmitResponse> {
  const { data } = await apiClient.post<PublicSubmitResponse>('/public/admissions', payload);
  return data;
}

export async function submitContact(payload: ContactPayload): Promise<PublicSubmitResponse> {
  const { data } = await apiClient.post<PublicSubmitResponse>('/public/contact', payload);
  return data;
}
