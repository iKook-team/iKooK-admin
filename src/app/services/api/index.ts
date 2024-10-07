import { QueryClient } from '@tanstack/react-query';
import axios, { AxiosRequestConfig } from 'axios';

export const queryClient = new QueryClient();

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data'
  }
});

export interface ApiClientRequestConfig<T = unknown> extends AxiosRequestConfig<T> {
  // If true (default), the error will be shown as a toast
  showError?: boolean;
}

export default async function fetch(config: ApiClientRequestConfig) {
  return await apiClient(config);
}
