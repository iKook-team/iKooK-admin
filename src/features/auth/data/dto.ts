import { CurrentUser } from './model.ts';
import { GenericResponse } from '../../../app/data/dto.ts';
import { LoginSchema } from '../domain/validators.ts';
import { z } from 'zod';

export type LoginRequest = z.infer<typeof LoginSchema>;

export type LoginResponse = GenericResponse<
  CurrentUser & {
    access_token: string;
    refresh_token: string;
  }
>;

export type ConsolidatedAuthRequest = LoginRequest & {
  [key: string]: string;
};

export type ConsolidatedAuthResponse = LoginResponse;
