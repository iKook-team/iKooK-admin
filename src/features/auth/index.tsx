import { useAuthAction } from './domain/usecase.ts';
import { useFormik } from 'formik';
import { initialAuthFieldData, loginFields } from './domain/fields.ts';
import { loginValidator } from './domain/validators.ts';
import { Link } from 'react-router-dom';
import { AuthType } from './domain/types.ts';
import logo from '../../app/assets/images/logo.svg';
import InputField from '../../app/components/input-field.tsx';

type AuthScreenProps = {
  type: AuthType;
};

export default function AuthScreen({ type }: AuthScreenProps) {
  const fields = loginFields;

  const { performAuth, loading } = useAuthAction(type);

  const formik = useFormik({
    initialValues: initialAuthFieldData,
    validationSchema: loginValidator,
    onSubmit: (values) => performAuth(values)
  });

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
        onSubmit={formik.handleSubmit}
      >
        {fields.map((field, index) => (
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
            $className={index !== fields.length - 1 ? 'mb-4 md:mb-8' : ''}
          />
        ))}
        {type === AuthType.login && (
          <Link className="text-black-olive font-poppins mt-4" to="/forgot-password">
            Forgot your password?
          </Link>
        )}
        <button type="submit" className="btn btn-primary mt-10 lg:mt-20" disabled={loading}>
          Login {loading && <span className="loading loading-spinner"></span>}
        </button>
      </form>
      <div className="flex-3"></div>
    </main>
  );
}
