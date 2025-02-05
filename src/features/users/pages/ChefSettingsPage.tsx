import { useMemo, useState } from 'react';
import { ToggleCard } from '../components/ToogleSwitch';
import UserSettingsTitle from '../components/UserSettingsTitle';
import { chefSettingsFields, chefSettingsInitials, customizedEmailField } from '../domain/fields';
import { ProfileField } from './UserProfilePage';
import { UserPageProps } from '../domain/types';
import { useFormik } from 'formik';
import { chefSettingSchema } from '../domain/validators';
import InputField from '../../../app/components/InputField';

export default function ChefSettingsPage({ user }: UserPageProps) {
  const [disableAccount, setDisableAccount] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  const fields = chefSettingsFields;
  const field = customizedEmailField;

  const emailField = useMemo(() => field.find((field) => field.id === 'email')!, [fields]);
  const current_password = useMemo(
    () => fields.find((field) => field.id === 'current_password')!,
    [fields]
  );
  const new_password = useMemo(
    () => fields.find((field) => field.id === 'new_password')!,
    [fields]
  );

  // const [currentPassword, setCurrentPassword] = useState('');
  // const [newPassword, setNewPassword] = useState('');

  const formik = useFormik({
    initialValues: chefSettingsInitials,
    validationSchema: chefSettingSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values); // where I will call save changes api
    }
  });

  return (
    <div>
      <UserSettingsTitle title={'Settings'} onSave={() => {}} />
      <div className="border-b pb-4">
        <h1 className="text-2xl">Manage Account</h1>
      </div>
      <div className="mb-5">
        <ToggleCard
          title={'Disable my account temporarily'}
          isOn={disableAccount}
          onToggle={() => {
            setDisableAccount(!disableAccount);
          }}
          underline={false}
        />
      </div>
      <div className="border-b pb-4">
        <h1 className="text-2xl">Change Password</h1>
      </div>
      <div className="flex flex-col gap-3 mt-2 w-[70%]">
        <InputField
          key={current_password.id}
          label={current_password.label}
          name={current_password.id}
          type={current_password.type}
          placeholder={current_password.placeholder}
          onChange={formik.handleChange}
          className={`mb-4 ${current_password.hidden ? 'hidden' : ''}`}
          value={formik.values[current_password.id as keyof typeof formik.values]} // ✅ Corrected value binding
          onBlur={formik.handleBlur} 
          error={
            formik.touched[current_password.id as keyof typeof formik.touched] &&
            formik.errors[current_password.id as keyof typeof formik.errors]
              ? formik.errors[current_password.id as keyof typeof formik.errors]
              : undefined
          }
        />
        <InputField
          key={new_password.id}
          label={new_password.label}
          name={new_password.id}
          type={new_password.type}
          placeholder={new_password.placeholder}
          onChange={formik.handleChange}
          className={`mb-4 ${new_password.hidden ? 'hidden' : ''}`}
          value={formik.values[new_password.id as keyof typeof formik.values]} // ✅ Corrected value binding
          onBlur={formik.handleBlur} // ✅ Handles input blur events
          error={
            formik.touched[new_password.id as keyof typeof formik.touched] &&
            formik.errors[new_password.id as keyof typeof formik.errors]
              ? formik.errors[new_password.id as keyof typeof formik.errors]
              : undefined
          }
        />
      </div>

      <div className="border-b pb-4 pt-4">
        <h1 className="text-2xl">Notifications</h1>
      </div>
      <div className="flex flex-col  mt-2 ">
        <ToggleCard
          title={'Email notifications'}
          isOn={emailNotif}
          onToggle={() => {setEmailNotif(!emailNotif)}}
          underline={false}
        />
        <ToggleCard
          title={'SMS notifications'}
          isOn={smsNotif}
          onToggle={() => {setSmsNotif(!smsNotif)}}
          underline={false}
        />
      </div>
      <div className="flex flex-col gap-3 mt-2 w-[70%]">
        <ProfileField field={emailField} value={user.email} onChange={() => {}} />
      </div>
    </div>
  );
}
