import { QueryClient } from '@tanstack/react-query';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import resetStore from '../../features/auth/domain/resetStore.ts';
import { toast } from 'react-toastify';
import useAuthStore from '../../features/auth/domain/store.ts';

export const queryClient = new QueryClient();

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data'
  }
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig<unknown>) => {
  const token = useAuthStore.getState().access;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  // console.log('Request:', {
  //   url: config.url,
  //   method: config.method,
  //   headers: config.headers,
  //   data: config.data
  // });
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log('Response:', extractResponseForLog(response));
    return response;
  },
  async (error: AxiosError) => {
    // console.error('Response:', error.message, extractResponseForLog(error.response!));

    const request = error.config;
    if (error.response?.status === 401) {
      try {
        if (request?.url?.includes('refresh')) {
          console.error('Error refreshing token:', error);
          await resetStore();
        } else {
          console.log('Refreshing token...');
          await handleUnauthorizedError(request!);
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        await resetStore();
      }
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

function extractResponseForLog(response: AxiosResponse): unknown {
  return {
    status: response.status,
    statusText: response.statusText,
    url: response.config.url,
    ...response.data
  };
}

async function handleUnauthorizedError(request: AxiosRequestConfig<unknown>) {
  const refresh = useAuthStore.getState().refresh;
  // if the refresh token is not present, cancel immediately
  if (!refresh) {
    return Promise.reject('Unauthorized');
  }

  try {
    // try to refresh the token
    const response = await fetch({
      url: 'user-management/api/token/refresh/',
      method: 'POST',
      data: {
        refresh: useAuthStore.getState().refresh
      }
    });
    useAuthStore.getState().refreshToken(response.data.access);
    return fetch(request);
  } catch (error) {
    return Promise.reject(error);
  }
}

interface ApiClientRequestConfig<T = unknown> extends AxiosRequestConfig<T> {
  // If true (default), the error will be shown as a toast
  showError?: boolean;
}

export default async function fetch(config: ApiClientRequestConfig) {
  return await apiClient(config);
}
