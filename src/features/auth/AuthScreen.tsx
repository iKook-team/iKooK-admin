import { useAuthAction } from './domain/usecase.ts';
import { useFormik } from 'formik';
import { loginFields } from './domain/fields.ts';
import { LoginSchema } from './domain/validators.ts';
import logo from '../../app/assets/icons/logo.svg';
import { FormEvent } from 'react';
import { toast } from 'react-toastify';
import InputField from '../../app/components/InputField.tsx';
import { ReactSVG } from 'react-svg';
import { extractInitialValues, withZodSchema } from '../../utils/zodValidator.ts';

export default function AuthScreen() {
  const { performAuth, loading, buttonText } = useAuthAction();

  const initialValues = extractInitialValues(LoginSchema);
  const formik = useFormik<typeof initialValues & { [key: string]: string }>({
    initialValues: initialValues,
    validate: withZodSchema(LoginSchema),
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

  return (
    <main className="w-full h-full bg-lotion flex flex-col items-center px-4">
      <div className="flex-1"></div>
      <ReactSVG src={logo} className="w-[10%] text-primary" wrapper="svg" />
      <div className="flex-2"></div>
      <h1 className="font-poppins font-medium text-black-base text-xl text-center">
        Login to Admin Dashboard
      </h1>
      <form
        className="mt-1 bg-white p-6 md:p-12 w-full lg:w-[50%] flex flex-col"
        onSubmit={onSubmit}
      >
        {loginFields.map((field) => (
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
            className={`mb-4 md:mb-8 ${field.hidden ? 'hidden' : ''}`}
          />
        ))}
        {/*{type === AuthType.login && (*/}
        {/*  <Link className="text-black-base-olive font-poppins" to="/forgot-password">*/}
        {/*    Forgot your password?*/}
        {/*  </Link>*/}
        {/*)}*/}
        <button type="submit" className="btn btn-primary mt-10 lg:mt-20" disabled={loading}>
          {buttonText}
          {loading && <span className="loading loading-spinner"></span>}
        </button>
      </form>
      <div className="flex-3"></div>
    </main>
  );
}
