import { useMemo, useState, useTransition } from 'react';
import { ToggleCard } from '../components/ToogleSwitch';
import UserSettingsTitle from '../components/UserSettingsTitle';
import { chefSettingsFields, customizedEmailField } from '../domain/fields';
import { UserPageProps } from '../domain/types';
import InputField from '../../../app/components/InputField';
import { useToggleNotificationSettings, useToggleUserActive } from '../domain/usecase.ts';
import { toast } from 'react-toastify';

interface ChefSettingsPageState {
  disable?: boolean;
  email?: boolean;
  sms?: boolean;
  newPassword: string;
  newPasswordError?: string;
  currentPassword: string;
  currentPasswordError?: string;
}

export default function ChefSettingsPage({ user, type }: UserPageProps) {
  const [state, setState] = useState<ChefSettingsPageState>({
    disable: user.settings?.disabled,
    email: user.settings?.email_notification,
    sms: user.settings?.sms_notification,
    newPassword: '',
    currentPassword: ''
  });

  const emailField = useMemo(() => customizedEmailField.find((field) => field.id === 'email')!, []);
  const currentPasswordField = useMemo(
    () => chefSettingsFields.find((field) => field.id === 'current_password')!,
    []
  );
  const newPasswordField = useMemo(
    () => chefSettingsFields.find((field) => field.id === 'new_password')!,
    []
  );

  const [isPending, startTransition] = useTransition();
  const toggleUserActive = useToggleUserActive(type);
  const toggleNotification = useToggleNotificationSettings({ type, id: user.id });

  const onSubmit = () => {
    if (isPending || !user) {
      return;
    }

    const actions: Promise<any>[] = [];
    if (state.disable !== user.settings?.disabled) {
      actions.push(toggleUserActive.mutateAsync({ id: user.id, disable: state.disable ?? false }));
    }
    if (state.email !== user.settings?.email_notification) {
      actions.push(toggleNotification.mutateAsync({ type: 'email' }));
    }
    if (state.sms !== user.settings?.sms_notification) {
      actions.push(toggleNotification.mutateAsync({ type: 'sms' }));
    }

    if (actions.length === 0) {
      return;
    }

    startTransition(async () => {
      try {
        await Promise.all(actions);
        toast('Settings saved successfully', { type: 'success' });
      } catch (error) {
        /* empty */
      }
    });
  };

  return (
    <div>
      <UserSettingsTitle title="Settings" loading={isPending} onSave={onSubmit} />

      <h1 className="text-2xl border-b pb-4">Manage Account</h1>
      <ToggleCard
        title="Disable my account temporarily"
        className="mb-5"
        isOn={state.disable ?? false}
        onToggle={() => setState((prev) => ({ ...prev, disable: !prev.disable }))}
        underline={false}
      />

      <h1 className="text-2xl border-b pb-4">Change Password</h1>
      <div className="flex flex-col gap-3 mt-2 w-[70%]">
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

      <h1 className="text-2xl border-b pb-4 pt-4">Notifications</h1>
      <div className="flex flex-col mt-2">
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
    </div>
  );
}
