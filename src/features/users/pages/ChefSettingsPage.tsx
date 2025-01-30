import { useMemo, useState } from 'react';
import { ToggleCard } from '../components/ToogleSwitch';
import UserSettingsTitle from '../components/UserSettingsTitle';
import { chefSettingsFields, customizedEmailField } from '../domain/fields';
import { ProfileField } from './UserProfilePage';
import { UserPageProps } from '../domain/types';

export default function ChefSettingsPage({ user }: UserPageProps){
  const [disableAccount, setDisableAccount] = useState(false);
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

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');


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
        <ProfileField
          field={current_password}
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e);
          }}
        />
         <ProfileField
          field={new_password}
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e);
          }}
        />
      </div>

      <div className="border-b pb-4 pt-4">
        <h1 className="text-2xl">Notifications</h1>
      </div>
      <div className="flex flex-col  mt-2 ">
        <ToggleCard
          title={'EMAIL Notifications'}
          isOn={false}
          onToggle={() => {}}
          underline={false}
        />
        <ToggleCard
          title={'SMS Notifications'}
          isOn={false}
          onToggle={() => {}}
          underline={false}
        />

      </div>
      <div className="flex flex-col gap-3 mt-2 w-[70%]">
        <ProfileField
          field={emailField}
          value={user.email}
          onChange={() => {
          }}
        />
      </div>
    </div>
  );
}
