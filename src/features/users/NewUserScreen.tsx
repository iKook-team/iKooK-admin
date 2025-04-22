import { useLocation } from 'react-router-dom';
import PageBackButton from '../../app/components/page/PageBackButton.tsx';
import { useMemo, useRef } from 'react';
import { UserType } from './domain/types.ts';
import PageTitle from '../../app/components/page/PageTitle.tsx';
import { useCreateUser } from './domain/usecase.ts';
import { toast } from 'react-toastify';
import UserProfileForm, { UserProfileFormRef } from './components/UserProfileForm.tsx';
import { LoadingSpinner } from '../../app/components/LoadingSpinner.tsx';

export default function NewUserScreen() {
  const { pathname } = useLocation();
  const [type] = useMemo(() => {
    const [type] = pathname.split('/').slice(1);
    return [type.slice(0, 4) as UserType];
  }, [pathname]);

  const formRef = useRef<UserProfileFormRef>(null);
  const mutation = useCreateUser(type);

  return (
    <>
      <PageBackButton />
      <PageTitle
        title={
          type === UserType.host ? 'New User' : type === UserType.chef ? 'New Chef' : 'New Admin'
        }
        className="mt-6 mb-7"
      />
      <UserProfileForm
        ref={formRef}
        type={type}
        onSave={(user) => {
          if (mutation.isPending) {
            return;
          }
          mutation
            .mutateAsync(user)
            .then(() => toast(`${type} created successfully`, { type: 'success' }));
        }}
      />

      <h1 className="font-poppins mt-10 text-base">
        A password will be generated and sent to the {type}&#39;s email
      </h1>

      <button
        onClick={() => formRef.current?.handleSubmit()}
        disabled={mutation.isPending}
        className="btn btn-primary h-min w-[200px] mt-4"
      >
        <LoadingSpinner isLoading={mutation.isPending}>Create new user</LoadingSpinner>
      </button>
    </>
  );
}
