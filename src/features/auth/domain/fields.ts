import Field from '../../../app/domain/field.ts';
import { ConsolidatedAuthRequest } from '../data/dto.ts';

export const loginFields: Field[] = [
  {
    id: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
    type: 'text'
  },
  {
    id: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password'
  }
];

export const twoFactorFields: Field[] = loginFields.concat([
  {
    id: 'otp',
    label: 'OTP',
    placeholder: 'Enter the 6-digit code sent to your email',
    type: 'text'
  },
  {
    id: 'userId',
    label: 'User ID',
    placeholder: 'Enter your user ID',
    type: 'text',
    hidden: true
  }
]);

export const authFieldsData: ConsolidatedAuthRequest = {
  username: '',
  password: '',
  otp: '',
  userId: ''
};
