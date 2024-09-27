import { useAuthAction } from './domain/usecase.ts';
import { useFormik } from 'formik';
import { authFieldsData, loginFields, twoFactorFields } from './domain/fields.ts';
import { loginValidator, twofactorConfirmationValidator } from './domain/validators.ts';
import { Link } from 'react-router-dom';
import { AuthType } from './domain/types.ts';
import logo from '../../app/assets/icons/logo.svg';
import { FormEvent, useEffect } from 'react';
import { toast } from 'react-toastify';
import InputField from '../../app/components/InputField.tsx';

type AuthScreenProps = {
  type: AuthType;
};

export default function AuthScreen({ type }: AuthScreenProps) {
  const { performAuth, loading, userId } = useAuthAction(type);

  const isTwoFactorMode = type === AuthType.login && userId;

  const fields = isTwoFactorMode ? twoFactorFields : loginFields;

  const formik = useFormik({
    initialValues: authFieldsData,
    validationSchema: isTwoFactorMode ? twofactorConfirmationValidator : loginValidator,
    onSubmit: (values) => performAuth(values)
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    await formik.validateForm();
    if (formik.isValid) {
      formik.handleSubmit(e);
    } else {
      e.preventDefault();
      Object.keys(formik.errors).forEach((key) => {
        toast(formik.errors[key], { type: 'error' });
      });
    }
  };

  useEffect(() => {
    if (userId) {
      formik.setFieldValue('userId', userId);
    }
  }, [userId]);

  return (
    <main className="w-full h-full bg-lotion flex flex-col items-center px-4">
      <div className="flex-1"></div>
      <img src={logo} alt="iKooK" />
      <div className="flex-2"></div>
      <h1 className="font-poppins font-medium text-black text-xl text-center">
        Login to Admin Dashboard
      </h1>
      <form
        className="mt-1 bg-white p-6 md:p-12 w-full lg:w-[50%] flex flex-col"
        onSubmit={onSubmit}
      >
        {fields.map((field) => (
          <InputField
            key={field.id}
            label={field.label}
            error={
              formik.touched[field.id] && formik.errors[field.id]
                ? formik.errors[field.id]
                : undefined
            }
            name={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={formik.values[field.id]}
            onChange={formik.handleChange}
            $className={`mb-4 md:mb-8 ${field.hidden ? 'hidden' : ''}`}
          />
        ))}
        {type === AuthType.login && (
          <Link className="text-black-olive font-poppins" to="/forgot-password">
            Forgot your password?
          </Link>
        )}
        <button type="submit" className="btn btn-primary mt-10 lg:mt-20" disabled={loading}>
          {type === AuthType.login && userId ? 'Authenticate' : 'Login'}
          {loading && <span className="loading loading-spinner"></span>}
        </button>
      </form>
      <div className="flex-3"></div>
    </main>
  );
}
