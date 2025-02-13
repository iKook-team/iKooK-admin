import { UserHeaderTab, UserType } from './domain/types.ts';
import { useFetchUserQuery } from './domain/usecase.ts';
import { useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import PageBackButton from '../../app/components/page/PageBackButton.tsx';
import UserHeader from './components/UserHeader.tsx';
import { User } from './data/model.ts';
import UserProfilePage from './pages/UserProfilePage.tsx';
import UserVerificationPage from './pages/UserVerificationPage.tsx';
import UserAccountPage from './pages/UserAccountPage.tsx';
import UserServicesPage from './pages/UserServicesPage.tsx';
import ChefNotificationPage from './pages/ChefNotificationpage.tsx';
import UserPasswordPage from './pages/UsersPasswordPage.tsx';
import ChefSettingsPage from './pages/ChefSettingsPage.tsx';
import { LoadingSpinner } from '../../app/components/LoadingSpinner.tsx';

export default function UserScreen() {
  const { pathname } = useLocation();
  const [type, userId] = useMemo(() => {
    const [type, userId] = pathname.split('/').slice(1);
    return [type.slice(0, 4) as UserType, userId];
  }, [pathname]);

  const [tab, setTab] = useState(UserHeaderTab.profile);

  const { isPending, user, error } = useFetchUserQuery(type, userId);

  return (
    <>
      <PageBackButton />
      {isPending || user === undefined ? (
        <LoadingSpinner />
      ) : error?.message ? (
        <div className="text-center text-red-500">{error.message}</div>
      ) : (
        <>
          <UserHeader
            selectedTab={tab}
            setTab={setTab}
            user={user}
            type={type}
            className="mt-6 mb-9"
          />
          <RenderTabContent tab={tab} user={user} type={type} />
        </>
      )}
    </>
  );
}

function RenderTabContent({ tab, user, type }: { tab: UserHeaderTab; user: User; type: UserType }) {
  switch (tab) {
    case UserHeaderTab.profile:
      return <UserProfilePage user={user} type={type} />;
    case UserHeaderTab.verification:
      return <UserVerificationPage user={user} type={type} />;
    case UserHeaderTab.account:
      return <UserAccountPage user={user} type={type} />;
    case UserHeaderTab.services:
      return <UserServicesPage user={user} type={type} />;
    case UserHeaderTab.notification:
      return <ChefNotificationPage user={user} type={type} />;
    case UserHeaderTab.password:
      return <UserPasswordPage user={user} type={type} />;
    case UserHeaderTab.settings:
      return <ChefSettingsPage user={user} type={type} />;
    default:
      return null;
  }
}
