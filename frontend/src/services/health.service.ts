import { apiClient } from './apiClient';

export type HealthResponse = {
  success: boolean;
  service: string;
  phase: number;
  timestamp: string;
};

export async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await apiClient.get<HealthResponse>('/health');
  return data;
}
