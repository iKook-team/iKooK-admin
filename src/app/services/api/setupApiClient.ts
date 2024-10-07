import { apiClient, ApiClientRequestConfig } from './index.ts';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { RootState } from '../store/types.ts';
import { Store } from '@reduxjs/toolkit';
import resetStore from '../../../features/auth/domain/resetStore.ts';
import { toast } from 'react-toastify';

export default function setupApiClient(store: Store) {
  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig<unknown>) => {
    const token = (store.getState() as RootState).auth?.token;
    if (token) {
      console.log('Setting token', token);
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  });

  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log('Response:', extractResponseForLog(response));
      return response;
    },
    async (error: AxiosError) => {
      console.error('Response:', error.message, extractResponseForLog(error.response!));

      const token = (store.getState() as RootState).auth?.token;
      // Access Token was expired
      if (token && error.response?.status === 401) {
        await resetStore();
      }

      if ((error.config as ApiClientRequestConfig)?.showError !== false) {
        // @ts-expect-error one of these will be defined
        toast(error?.response?.data?.message ?? error?.response?.data?.error ?? error?.message, {
          type: 'error'
        });
      }

      return Promise.reject(error);
    }
  );
}

function extractResponseForLog(response: AxiosResponse): unknown {
  return {
    status: response.status,
    statusText: response.statusText,
    url: response.config.url,
    ...response.data
  };
}
