import UserSettingsTitle from '../components/UserSettingsTitle';
import { chefAccountFields } from '../domain/fields';
import { UserPageProps, UserType } from '../domain/types';
import { ProfileField } from './UserProfilePage';

export default function UserAccountPage({ user, type }: UserPageProps) {
  const fields = chefAccountFields;
  return (
    <div>
      <UserSettingsTitle
        title={type === UserType.host ? 'Manage Account' : 'Bank Account'}
        onSave={() => {}}
      />
      {type === UserType.host && (
        <div>
          <h1 className="text-lg text-gray-400 mb-10">
            To disable or delete your account all over the site
          </h1>
          <div className="flex justify-between">
            <h1>Disable my account temporarily</h1>
            <input type="checkbox" />
            <div className=""></div>
          </div>
          <button onClick={() => {}} className="btn btn-primary mt-5 ">
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
