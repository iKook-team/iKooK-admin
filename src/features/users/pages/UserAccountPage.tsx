import { FormEvent, useState } from 'react';
import UserSettingsTitle from '../components/UserSettingsTitle';
import { chefAccountFields, chefAccountInitials } from '../domain/fields';
import { UserPageProps, UserType } from '../domain/types';
import ToggleSwitch from '../components/ToogleSwitch';
import { useDeleteAccount } from '../domain/usecase';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { chefAccountSchema } from '../domain/validators';
import InputField from '../../../app/components/InputField';

export default function UserAccountPage({ type, user }: UserPageProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: chefAccountInitials,
    validationSchema: chefAccountSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values);
    }
  });

  const mutation = useDeleteAccount(type);

  const onSave = async (e: FormEvent<HTMLFormElement>) => {

    console.log('save clicked')
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

  const onSubmit = async () => {
    if (loading || user === undefined) {
      return;
    }

    try {
      setLoading(true);

      const response = await mutation.mutateAsync({ id: user.id });

      toast(response.data.data, { type: 'success' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <UserSettingsTitle
        title={type === UserType.host ? 'Manage Account' : 'Bank Account'}
        onSave={() => onSave} // ✅ Fixed function reference
      />

      {type === UserType.host && (
        <div>
          <h1 className="text-lg text-gray-400 mb-5">
            To disable or delete your account all over the site
          </h1>
          <div className="flex justify-between items-center">
            <h1>Disable my account temporarily</h1>
            <ToggleSwitch isOn={isSelected} onToggle={() => setIsSelected(!isSelected)} />
          </div>
          <button
            disabled={!isSelected || loading}
            onClick={onSubmit}
            className="btn btn-primary mt-5"
          >
            {loading ? 'Deleting Account' : 'Delete Account'}
          </button>
        </div>
      )}

      {/* ✅ Formik Form */}
      <form onSubmit={onSave} className="flex flex-col gap-4 w-full lg:w-[90%] self-start mt-5">
        {type === UserType.chef &&
          chefAccountFields.map((field) => {
            // const fieldKey = field.id as keyof typeof formik.values;

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
                  value={formik.values[field.id as keyof typeof formik.values]} // ✅ Corrected value binding
                  onBlur={formik.handleBlur} // ✅ Handles input blur events
                  error={
                    formik.touched[field.id as keyof typeof formik.touched] && formik.errors[field.id as keyof typeof formik.errors]
                      ? formik.errors[field.id as keyof typeof formik.errors]
                      : undefined
                  }
                />
              </div>
            );
          })}

        <button type="submit" className="btn btn-primary">
          Save Change
        </button>
      </form>
    </div>
  );
}
