import { useMemo, useState } from 'react';
import { ToggleCard } from '../components/ToogleSwitch';
import UserSettingsTitle from '../components/UserSettingsTitle';
import { UserPageProps } from '../domain/types';
import { ProfileField } from './UserProfilePage';
import { customizedEmailField } from '../domain/fields';

export default function ChefNotificationPage({ user }: UserPageProps) {
  const fields = customizedEmailField;
 
  const emailField = useMemo(
    () => fields.find((field) => field.id === 'email')!,
    [fields]
  );
  const [emailNotf, setEmailNotif] = useState(false);
  const [smsNotf, setSmsNotif] = useState(false);

  console.log(user);
  return (
    <div>
      <UserSettingsTitle title={'Notifications'} onSave={() => {}} />
      <ToggleCard
        title={'Email notifications'}
        isOn={emailNotf}
        onToggle={() => setEmailNotif(!emailNotf)}
        underline={false}
      />
      <ToggleCard
        title={'Sms notifications'}
        isOn={smsNotf}
        onToggle={() => setSmsNotif(!smsNotf)}
        underline={false}
      />
      <div className="mt-10">
        <ProfileField field={emailField} value={user.email} onChange={() => {}} />
      </div>
    </div>
  );
}
