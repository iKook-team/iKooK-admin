import { useMemo, useState } from 'react';
import { ToggleCard } from '../components/ToogleSwitch';
import UserSettingsTitle from '../components/UserSettingsTitle';
import { customizedEmailField, userSettingsFields } from '../domain/fields';
import { UserPageProps } from '../domain/types';
import InputField from '../../../app/components/InputField';
import { useUpdateUser } from '../domain/usecase.ts';
import { toast } from 'react-toastify';
import { capitalize } from '../../../utils/strings.ts';

interface UserSettingsPageProps extends UserPageProps {
  select?: 'account' | 'notifications' | 'password';
}

interface UserSettingsPageState {
  disable?: boolean;
  email?: boolean;
  sms?: boolean;
  newPassword: string;
  newPasswordError?: string;
  currentPassword: string;
  currentPasswordError?: string;
}

export default function UserSettingsPage({ select, user, type }: UserSettingsPageProps) {
  const [state, setState] = useState<UserSettingsPageState>({
    disable: !user.is_active,
    email: user.email_notify,
    sms: user.sms_notify,
    newPassword: '',
    currentPassword: ''
  });

  const emailField = useMemo(() => customizedEmailField.find((field) => field.id === 'email')!, []);
  const currentPasswordField = useMemo(
    () => userSettingsFields.find((field) => field.id === 'current_password')!,
    []
  );
  const newPasswordField = useMemo(
    () => userSettingsFields.find((field) => field.id === 'new_password')!,
    []
  );

  const mutation = useUpdateUser(type);

  const onSubmit = async () => {
    if (mutation.isPending || !user) {
      return;
    }

    try {
      await mutation.mutateAsync({
        id: user.id,
        data: {
          email_notify: state.email,
          sms_notify: state.sms,
          is_active: !state.disable
        }
      });
      toast(`${capitalize(select) ?? 'Settings'} saved successfully`, { type: 'success' });
    } catch (error) {
      /* empty */
    }
  };

  return (
    <div>
      <UserSettingsTitle
        title={
          (select === 'account'
            ? 'Manage Account'
            : select === 'password'
              ? 'Reset Password'
              : select) ?? 'Settings'
        }
        loading={mutation.isPending}
        onSave={onSubmit}
      />

      {(!select || select === 'account') && (
        <>
          {!select ? (
            <h1 className="text-2xl border-b pb-3">Manage Account</h1>
          ) : (
            <p className="text-sm text-dark-charcoal/70">
              To disable or delete your profile all over the site
            </p>
          )}
          <ToggleCard
            title="Disable my account temporarily"
            className="pt-4 pb-5"
            isOn={state.disable ?? false}
            onToggle={() => setState((prev) => ({ ...prev, disable: !prev.disable }))}
            underline={false}
          />
        </>
      )}

      {(!select || select === 'password') && (
        <>
          {!select && <h1 className="text-2xl border-b pb-3">Change Password</h1>}
          <div className="flex flex-col gap-3 pt-4 w-[70%]">
            <InputField
              {...currentPasswordField}
              onChange={(e) => setState((prev) => ({ ...prev, currentPassword: e.target.value }))}
              className={`mb-4 ${currentPasswordField.hidden ? 'hidden' : ''}`}
              value={state.currentPassword}
              error={state.currentPasswordError}
            />
            <InputField
              {...newPasswordField}
              onChange={(e) => setState((prev) => ({ ...prev, newPassword: e.target.value }))}
              className={`mb-4 ${newPasswordField.hidden ? 'hidden' : ''}`}
              value={state.newPassword}
              error={state.newPasswordError}
            />
          </div>
        </>
      )}

      {(!select || select === 'notifications') && (
        <>
          {!select && <h1 className="text-2xl border-b pb-3 pt-4">Notifications</h1>}
          <div className="flex flex-col pt-4">
            <ToggleCard
              title="Email Notifications"
              isOn={state.email ?? false}
              onToggle={() => setState((prev) => ({ ...prev, email: !prev.email }))}
              underline={false}
            />
            <ToggleCard
              title="SMS Notifications"
              isOn={state.sms ?? false}
              onToggle={() => setState((prev) => ({ ...prev, sms: !prev.sms }))}
              underline={false}
            />
          </div>
          <InputField className="mt-2 w-[70%]" {...emailField} value={user.email} readOnly={true} />
        </>
      )}
    </div>
  );
}
