import axios from 'axios';

function resolveApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.trim();
  if (configured) {
    return configured;
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  return '/api';
}

const baseURL = resolveApiBaseUrl();

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
