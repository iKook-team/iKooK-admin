import Field from '../../../app/domain/field.ts';
import { ConsolidatedAuthRequest } from '../data/dto.ts';

export const loginFields: Field[] = [
  {
    id: 'username',
    label: 'E-mail',
    placeholder: 'Enter your email address',
    type: 'email'
  },
  {
    id: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password'
  }
];

export const initialAuthFieldData: ConsolidatedAuthRequest = {
  username: '',
  password: ''
};
