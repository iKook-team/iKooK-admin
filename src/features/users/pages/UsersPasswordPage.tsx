import UserSettingsTitle from '../components/UserSettingsTitle';
import { UserPageProps } from '../domain/types';
import { ProfileField } from './UserProfilePage';

export default function UserPasswordPage({  }: UserPageProps) {

  const password = {
    id: 'email',
    label: 'All the emails will be sent to the below email address',
    placeholder: 'sandrabullock@ikook.co.uk',
    type: 'email',
  };


  return (
    <div>
      <UserSettingsTitle title={'Rest Password'} onSave={() => {}} />
    
      <div className="mt-10">
        <ProfileField field={password} value={""} onChange={() => {}} />
      </div>
    </div>
  );
}
