import UserSettingsTitle from '../components/UserSettingsTitle';
import { UserPageProps } from '../domain/types';
import { ProfileField } from './UserProfilePage';

export default function UserPasswordPage({  }: UserPageProps) {

  const password = {
    id: 'password',
    label: 'New Password',
    placeholder: '*******',
    type: 'password',
  };


  return (
    <div>
      <UserSettingsTitle title={'Reset Password'} onSave={() => {}} />
    
      <div className="mt-10">
        <ProfileField field={password} value={""} onChange={() => {}} />
      </div>
    </div>
  );
}
