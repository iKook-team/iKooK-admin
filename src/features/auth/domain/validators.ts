import * as Yup from 'yup';

export const loginValidator = Yup.object().shape({
  username: Yup.string().required('Email is required'),
  password: Yup.string().required('Password is required')
});
