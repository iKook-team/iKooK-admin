import { CurrentUser } from '../data/model.ts';

export enum AuthType {
  login = 'login',
  forgotPassword = 'forgot-password',
  register = 'register',
  resetPassword = 'reset-password'
}

export interface AuthState extends CurrentUser {
  token: string | null;
}
