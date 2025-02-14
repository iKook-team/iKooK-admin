import { useLocation } from 'react-router-dom';
import PageBackButton from '../../app/components/page/PageBackButton.tsx';
import { useMemo, useState } from 'react';
import { UserType } from './domain/types.ts';
import PageTitle from '../../app/components/page/PageTitle.tsx';
import { hostProfileFields } from './domain/fields.ts';
import { ProfileField } from './pages/UserProfilePage.tsx';
import DragAndDropImage from './components/ImageDraggable.tsx';
import { useCheckUserNameValidity, useCreateNewUser, useGetRole } from './domain/usecase.ts';
import { toast } from 'react-toastify';

export default function NewUserScreen() {
  const { pathname } = useLocation();
  const [type] = useMemo(() => {
    const [type] = pathname.split('/').slice(1);
    return [type.slice(0, 4) as UserType];
  }, [pathname]);

  const fields = hostProfileFields;
  const firstName = useMemo(() => fields.find((field) => field.id === 'first_name')!, [fields]);
  const lastName = useMemo(() => fields.find((field) => field.id === 'last_name')!, [fields]);
  const userName = useMemo(() => fields.find((field) => field.id === 'user_name')!, [fields]);
  const [creating, setCreating] = useState(false);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [username, setUserName] = useState('');
  const { createUser } = useCreateNewUser(type);
  const { isPending, successMsg, errorMsg } = useCheckUserNameValidity(username);
  const { roles } = useGetRole({ isAdmin: true });

  const types = type === 'host' ? 'user' : 'chef';

  const role = roles.filter((item) => item.name === types).map((item) => item.id)[0];

  return (
    <>
      <PageBackButton />
      <div className="m-3"></div>
      <PageTitle
        title={
          type === UserType.host ? 'New User' : type === UserType.chef ? 'New Chef' : 'New Admin'
        }
      />
      <div className="flex flex-col items-center justify-center">
        <form className="flex flex-col gap-4 w-full lg:w-[90%] self-start mt-5">
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
          <div className="flex-1">
            <ProfileField
              field={userName}
              value={username}
              onChange={(e) => {
                setUserName(e);
              }}
            />
          </div>
          {username && (
            <div>
              {isPending && <p className="text-blue-500">Checking username...</p>}
              {errorMsg && !isPending && <p className="text-red-500"> {errorMsg}</p>}
              {successMsg && !isPending && <p className="text-green"> {successMsg}</p>}
            </div>
          )}
          {fields.map((field) => {
            if (field.id === 'first_name' || field.id === 'last_name' || field.id === 'user_name') {
              return null;
            }

            let onchangeFunc = (e: string) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
      <div className=" w-max">
        <DragAndDropImage />
      </div>

      <h1 className="font-poppins mt-10 text-base">
        A password will be generated and sent to the {type}'s email
      </h1>

      <button
        onClick={async () => {
          if (creating) {
            return;
          }

          try {
            setCreating(true);

            await createUser({
              first_name: first_name,
              last_name: last_name,
              username: username,
              email: email,
              mobile: mobile,
              role: role
            });
            toast(`${type} created successfully`, { type: 'success' });
            setUserName('');
            setMobile('');
            setEmail('');
            setFirstName('');
            setLastName('');
          } finally {
            setCreating(false);
          }
        }}
        disabled={errorMsg != undefined || username.length <= 3 || isPending}
        className="btn btn-primary h-min w-[200px] mt-4"
      >
        Create new user
      </button>
    </>
  );
}
