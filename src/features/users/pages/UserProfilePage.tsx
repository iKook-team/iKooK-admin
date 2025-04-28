import { UserPageProps } from '../domain/types.ts';
import UserSettingsTitle from '../components/UserSettingsTitle.tsx';
import { useUpdateUser } from '../domain/usecase.ts';
import { toast } from 'react-toastify';
import UserProfileForm, { UserProfileFormRef } from '../components/UserProfileForm.tsx';
import { useRef } from 'react';

export default function UserProfilePage({ user, type }: UserPageProps) {
  const formRef = useRef<UserProfileFormRef>(null);
  const mutation = useUpdateUser(type);

  return (
    <div className="flex flex-col items-center justify-center">
      <UserSettingsTitle
        title="Profile"
        onSave={() => formRef.current?.handleSubmit()}
        loading={mutation.isPending}
      />
      <UserProfileForm
        ref={formRef}
        type={type}
        user={user}
        onSave={(data) => {
          mutation
            .mutateAsync({
              id: user.id,
              data
            })
            .then(() => toast(`${type} profile edited successfully`, { type: 'success' }));
        }}
      />
    </div>
  );
}
