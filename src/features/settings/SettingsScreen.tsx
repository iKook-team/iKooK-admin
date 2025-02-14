import PageTitle from '../../app/components/page/PageTitle.tsx';
import Pills from '../../app/components/Pills.tsx';
import { SettingsType } from './domain/types.ts';
import { useQueryState } from 'nuqs';
import { UserType } from '../users/domain/types.ts';
import UsersScreen from '../users/UsersScreen.tsx';

export default function SettingsScreen() {
  const [tab, setTab] = useQueryState('tab', {
    defaultValue: SettingsType.admin
  });

  return (
    <>
      <PageTitle title="Settings" />
      <Pills active={tab} setActive={setTab} items={Object.values(SettingsType)} />
      <RenderTabContent tab={tab as SettingsType} />
    </>
  );
}

function RenderTabContent({ tab }: { tab: SettingsType }) {
  switch (tab) {
    case SettingsType.admin:
      return <UsersScreen type={UserType.admin} />;
    default:
      return null;
  }
}
