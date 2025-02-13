import { useFormik } from 'formik';
import InputField from '../../../app/components/InputField';
import UserSettingsTitle from '../components/UserSettingsTitle';
import { chefPasswordField, userPasswordInitiails } from '../domain/fields';
import { UserPageProps } from '../domain/types';
import { chefPasswordSchema } from '../domain/validators';

export default function UserPasswordPage({}: UserPageProps) {
  const formik = useFormik({
    initialValues: userPasswordInitiails,
    validationSchema: chefPasswordSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values);
    }
  });


  return (
    <div>
      <UserSettingsTitle title={'Reset Password'} onSave={() => {}} />
      <div className="mt-10">
        {chefPasswordField.map((field) => (
          <InputField
            key={field.id}
            label={field.label}
            name={field.id}
            value={formik.values[field.id as keyof typeof formik.values]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} // ✅ Handles input blur events
            error={
              formik.touched[field.id as keyof typeof formik.touched] && formik.errors[field.id as keyof typeof formik.errors]
                ? formik.errors[field.id as keyof typeof formik.errors]
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
