import Field from '../../../app/domain/field.ts';

export const loginFields: Field[] = [
  {
    id: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'text'
  },
  {
    id: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password'
  }
];
