import { InferType } from 'yup';
import { loginValidator, twofactorConfirmationValidator } from '../domain/validators.ts';
import { User } from './model.ts';

export type LoginRequest = InferType<typeof loginValidator>;

export type TwoFactorConfirmationRequest = InferType<typeof twofactorConfirmationValidator>;

export type LoginResponse = GenericResponse<
  User & {
    access: string;
    refresh: string;
  }
>;

export type ConsolidatedAuthRequest = LoginRequest &
  TwoFactorConfirmationRequest & {
    [key: string]: string;
  };

export type ConsolidatedAuthResponse = LoginResponse;
