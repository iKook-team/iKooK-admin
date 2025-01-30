import { useState } from 'react';
import UserSettingsTitle from '../components/UserSettingsTitle';
import { chefAccountFields } from '../domain/fields';
import { UserPageProps, UserType } from '../domain/types';
import { ProfileField } from './UserProfilePage';
import ToggleSwitch from '../components/ToogleSwitch';

export default function UserAccountPage({ type }: UserPageProps) {
  const [isSelected, setIsSelected] = useState(false);

  const fields = chefAccountFields;
  return (
    <div>
      <UserSettingsTitle
        title={type === UserType.host ? 'Manage Account' : 'Bank Account'}
        onSave={() => {}}
      />
      {type === UserType.host && (
        <div>
          <h1 className="text-lg text-gray-400 mb-5">
            To disable or delete your account all over the site
          </h1>
          <div className="flex justify-between items-center">
            <h1>Disable my account temporarily</h1>
            {/* <input type="checkbox" /> */}
            <ToggleSwitch isOn={isSelected} onToggle={() => setIsSelected(!isSelected)} />
            <div className=""></div>
          </div>
          <button disabled={!isSelected} onClick={() => {}} className="btn btn-primary mt-5 ">
            Delete Account
          </button>
        </div>
      )}
      <form className="flex flex-col gap-4 w-full lg:w-[90%] self-start mt-5">
        {type === UserType.chef &&
          fields.map((field) => {
            let onchangeFunc = (e: string) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              e;
            };
            let value = '';

            if (field.id === 'mobile') {
              // onchangeFunc = (e) => (e){};
              // value = mobile;
            } else if (field.id === 'email') {
              // onchangeFunc = (e) => setEmail(e);
              // value = email;
            }

            return (
              <div key={field.id}>
                <ProfileField
                  key={field.id}
                  field={field}
                  value={value}
                  onChange={(e) => {
                    onchangeFunc(e);
                  }}
                />
              </div>
            );
          })}
      </form>
    </div>
  );
}
