import { useLocation } from 'react-router-dom';
import PageBackButton from '../../../app/components/page/PageBackButton';
import { use, useMemo, useState } from 'react';
import { UserType } from '../domain/types';
import PageTitle from '../../../app/components/page/PageTitle';
import { chefProfileFields, hostProfileFields } from '../domain/fields';
import { ProfileField } from './UserProfilePage';
import DragAndDropImage from '../components/ImageDraggable';
import { useCreateNewUser } from '../domain/usecase';

export default function NewUser() {
  const { pathname } = useLocation();
  const [type] = useMemo(() => {
    const [type] = pathname.split('/').slice(1);
    return [type.slice(0, 4) as UserType];
  }, [pathname]);

  const fields = type === UserType.host ? hostProfileFields : chefProfileFields;
  const firstName = useMemo(() => fields.find((field) => field.id === 'first_name')!, [fields]);
  const lastName = useMemo(() => fields.find((field) => field.id === 'last_name')!, [fields]);

  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
    const [username, setUserName] = useState('username');

  const { createUser, loading } = useCreateNewUser(type);

  return (
    <>
      <PageBackButton />
      <div className="m-3"></div>
      <PageTitle title={type === UserType.host ? 'New User' : 'New Chef'} />
      <div className="flex flex-col items-center justify-center">
        <form className="flex flex-col gap-4 w-full lg:w-[90%] self-start mt-10">
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <ProfileField
                field={firstName}
                value={first_name}
                onChange={(e) => {
                  setFirstName(e);
                }}
              />
            </div>
            <div className="flex-1">
              <ProfileField
                field={lastName}
                value={last_name}
                onChange={(e) => {
                  setLastName(e);
                }}
              />
            </div>
          </div>
          {fields.map((field) => {
            if (field.id === 'first_name' || field.id === 'last_name') {
              return null;
            }

            let onchangeFunc = (e: string) => {
              e;
            };
            let value = '';

            if (field.id === 'mobile') {
              onchangeFunc = (e) => setMobile(e);
              value = mobile;
            } else if (field.id === 'email') {
              onchangeFunc = (e) => setEmail(e);
              value = email;
            }

            return (
              <ProfileField
                key={field.id}
                field={field}
                value={value}
                onChange={(e) => {
                  onchangeFunc(e);
                }}
              />
            );
          })}
        </form>
      </div>
      <div className=" w-max">
        <DragAndDropImage />
      </div>

      <h1 className="font-poppins mt-20 text-base">
        A password will be generated and send to the {type}'s email
      </h1>

      <button
        onClick={() => {
          createUser({ first_name, last_name, email, mobile, role: type, username });
        }}
        disabled={loading}
        className="btn btn-primary h-min w-[200px] mt-4"
      >
        Create new user
      </button>
    </>
  );
}
