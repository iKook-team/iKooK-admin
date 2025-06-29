import Constants from '../../../utils/constants.ts';
import { User } from '../data/model.ts';
import { UserHeaderTab, UserType } from '../domain/types.ts';
import { useMemo } from 'react';
import { MdLocationOn, MdStar } from 'react-icons/md';
import { IconType } from 'react-icons';

interface UserHeaderProps {
  selectedTab?: UserHeaderTab;
  user: User;
  type: UserType;
  className?: string;
  setTab: (tab: UserHeaderTab) => void;
}

export default function UserHeader({
  selectedTab,
  user,
  type,
  className,
  setTab
}: UserHeaderProps) {
  const tabs = useMemo(
    () =>
      type == UserType.host
        ? [
            UserHeaderTab.profile,
            UserHeaderTab.account,
            UserHeaderTab.password,
            UserHeaderTab.notification
          ]
        : [
            UserHeaderTab.profile,
            UserHeaderTab.services,
            UserHeaderTab.account,
            UserHeaderTab.verification,
            UserHeaderTab.settings
          ],
    [type]
  );

  return (
    <div
      className={`py-5 px-6 flex flex-col lg:flex-row items-center justify-between border rounded-sm ${className !== undefined ? className : ''}`}
    >
      <div className="w-full lg:w-[30%]">
        <div className="w-full flex flex-row items-center justify-center overflow-hidden">
          <div className="w-1/3 min-w-[80px] max-w-[120px] aspect-square flex-shrink-0">
            <img
              src={Constants.getImageUrl(user.avatar, `${user.first_name}  ${user.last_name}`)}
              alt={user.first_name}
              className="w-full h-full object-cover rounded-full border-[3px] border-primary"
            />
          </div>
          <div className="ml-6 flex-grow min-w-0">
            <p className="text-2xl font-medium truncate capitalize">{`${user.first_name} ${user.last_name}`}</p>
            <p className="text-xs truncate">{user.email}</p>
            {type == UserType.chef && (
              <div className="flex">
                <div>{user.country && <Info Icon={MdLocationOn} title={user.country} />}</div>
                <div>
                  {user.average_rating ? (
                    <Info Icon={MdStar} title={user.average_rating.toString()} />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 lg:mt-0 ml-auto w-full lg:w-[60%] bg-dark-charcoal/10 px-3 py-2 rounded-md flex flex-row">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2.5 rounded flex-1 ${tab == selectedTab ? 'bg-primary' : ''} capitalize`}
            onClick={() => setTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

function Info({ Icon, title }: { Icon: IconType; title: string }) {
  return (
    <div className="flex flex-row items-center gap-1">
      <Icon className="text-primary" size={12} />
      <p className="text-xs">{title}</p>
    </div>
  );
}
