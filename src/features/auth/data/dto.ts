import { InferType } from 'yup';
import { loginValidator } from '../domain/validators.ts';

export type LoginRequest = InferType<typeof loginValidator>;

export type LoginResponse = {
  id: string;
  first_name: string;
  last_name: string;
  access: string;
  refresh: string;
  role: string;
};

export type ConsolidatedAuthRequest = LoginRequest & {
  [key: string]: string;
};

export type ConsolidatedAuthResponse = LoginResponse;
