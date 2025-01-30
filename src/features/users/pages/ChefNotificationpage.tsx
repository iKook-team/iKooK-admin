import { useState } from 'react';
import { ToggleCard } from '../components/ToogleSwitch';
import UserSettingsTitle from '../components/UserSettingsTitle';
import { UserPageProps } from '../domain/types';
import { ProfileField } from './UserProfilePage';

export default function ChefNotificationPage({ user }: UserPageProps) {

  const email = {
    id: 'email',
    label: 'All the emails will be sent to the below email address',
    placeholder: 'sandrabullock@ikook.co.uk',
    type: 'email',
  };
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
        <ProfileField field={email} value={user.email} onChange={() => {}} />
      </div>
    </div>
  );
}
