import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import { RootState } from './store';
import {
  LoginRequest,
  LoginResponse,
  TwoFactorConfirmationRequest
} from '../features/auth/data/dto.ts';
import { leaveFields } from '../utils/fieldManipulation.ts';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token;
    if (token) {
      console.log('Setting token', token);
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQueryWithLogging: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  console.log('Request:', args);
  const result = await baseQuery(args, api, extraOptions);
  console.log('Response:', result);
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithLogging,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: 'admin/signin',
        method: 'POST',
        body: leaveFields(body, 'username', 'password')
      })
    }),
    twofactorConfirmation: builder.mutation<LoginResponse, TwoFactorConfirmationRequest>({
      query: (body) => ({
        url: 'admin/twofactor-confirmation',
        method: 'POST',
        body: leaveFields(body, 'otp', 'userId')
      })
    }),
    forgotPassword: builder.query<LoginResponse, string>({
      query: (email) => ({
        url: 'auth/generate-password-reset-link',
        method: 'POST',
        params: { email }
      })
    })
  })
});

export const { useLoginMutation, useLazyForgotPasswordQuery, useTwofactorConfirmationMutation } =
  api;
