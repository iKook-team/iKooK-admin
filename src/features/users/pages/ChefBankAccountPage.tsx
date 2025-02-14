import { FormEvent } from 'react';
import UserSettingsTitle from '../components/UserSettingsTitle';
import { chefAccountFields, chefAccountInitials } from '../domain/fields';
import { UserPageProps } from '../domain/types';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { chefAccountSchema } from '../domain/validators';
import InputField from '../../../app/components/InputField';

export default function ChefBankAccountPage({ user }: UserPageProps) {
  console.log(user);
  const formik = useFormik({
    initialValues: chefAccountInitials,
    validationSchema: chefAccountSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values); // where I will call save changes api
    }
  });

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    console.log('save clicked');
    e.preventDefault();
    await formik.validateForm();

    if (formik.isValid) {
      formik.handleSubmit(e);
    } else {
      Object.keys(formik.errors).forEach((key) => {
        toast(formik.errors[key as keyof typeof formik.errors], { type: 'error' });
      });
    }
  };

  return (
    <div>
      <UserSettingsTitle
        title={'Bank Account'}
        onSave={() => onSave} // ✅ Fixed function reference
      />
      {/* ✅ Formik Form */}
      <form onSubmit={onSave} className="flex flex-col gap-4 w-full lg:w-[90%] self-start mt-5">
        {chefAccountFields.map((field) => {
          return (
            <div key={field.id}>
              <InputField
                key={field.id}
                label={field.label}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
                onChange={formik.handleChange}
                className={`mb-4 ${field.hidden ? 'hidden' : ''}`}
                value={formik.values[field.id as keyof typeof formik.values]}
                onBlur={formik.handleBlur} // ✅ Handles input blur events
                error={
                  formik.touched[field.id as keyof typeof formik.touched] &&
                  formik.errors[field.id as keyof typeof formik.errors]
                    ? formik.errors[field.id as keyof typeof formik.errors]
                    : undefined
                }
              />
            </div>
          );
        })}
      </form>
    </div>
  );
}
