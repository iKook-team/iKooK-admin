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
        <span className="loading loading-dots loading-lg"></span>
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
      return <UserAccountPage user={user} type={type} />
    default:
      return null;
  }
}
