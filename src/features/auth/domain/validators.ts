import * as Yup from 'yup';

export const loginValidator = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
});

export const twofactorConfirmationValidator = Yup.object().shape({
  userId: Yup.string().required('User ID is required'),
  otp: Yup.string().required('OTP is required')
});
