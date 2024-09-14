export enum AuthType {
  login = 'login',
  forgotPassword = 'forgot-password',
  register = 'register',
  resetPassword = 'reset-password'
}

export interface AuthState {
  token: string | null;
}
