import { UserHeaderTab, UserType } from './domain/types.ts';
import { useFetchUserQuery } from './domain/usecase.ts';
import { useLocation, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import PageBackButton from '../../app/components/page/PageBackButton.tsx';
import UserHeader from './components/UserHeader.tsx';
import { User } from './data/model.ts';
import UserProfilePage from './pages/UserProfilePage.tsx';
import UserVerificationPage from './pages/UserVerificationPage.tsx';
import ChefBankAccountPage from './pages/ChefBankAccountPage.tsx';
import UserServicesPage from './pages/UserServicesPage.tsx';
import UserSettingsPage from './pages/UserSettingsPage.tsx';
import { LoadingSpinner } from '../../app/components/LoadingSpinner.tsx';
import { useQueryState } from 'nuqs';

export default function UserScreen() {
  const { pathname } = useLocation();
  const type = useMemo(
    () => pathname?.split('/')?.slice(1)?.[0]?.slice(0, 4) as UserType,
    [pathname]
  );
  const { id } = useParams();

  const [tab, setTab] = useQueryState('tab', {
    defaultValue: UserHeaderTab.profile
  });

  const { isPending, data: user, error } = useFetchUserQuery(type, id);

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
            selectedTab={tab as UserHeaderTab}
            setTab={setTab}
            user={user}
            type={type}
            className="mt-6 mb-9"
          />
          <RenderTabContent
            tab={tab as UserHeaderTab}
            user={{ ...user, id: user.id ?? id }}
            type={type}
          />
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
      return type === UserType.host ? (
        <UserSettingsPage user={user} type={type} select="account" />
      ) : (
        <ChefBankAccountPage user={user} type={type} />
      );
    case UserHeaderTab.services:
      return <UserServicesPage user={user} type={type} />;
    case UserHeaderTab.notification:
      return <UserSettingsPage user={user} type={type} select="notifications" />;
    case UserHeaderTab.password:
      return <UserSettingsPage user={user} type={type} select="password" />;
    case UserHeaderTab.settings:
      return <UserSettingsPage user={user} type={type} />;
    default:
      return null;
  }
}
