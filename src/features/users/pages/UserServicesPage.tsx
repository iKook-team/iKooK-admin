import { useMemo, useState } from 'react';
import { ToggleCard } from '../components/ToogleSwitch';
import UserSettingsTitle from '../components/UserSettingsTitle';
import { ProfileField } from './UserProfilePage';
import { UserPageProps } from '../domain/types';
import { chefServiceFields } from '../domain/fields';

export default function UserServicesPage({ user }: UserPageProps) {
  console.log(user);
  const [isCah, setIsCat] = useState(false);
  const [isLe, SetIsLe] = useState(false);
  const [isMp, setIsMp] = useState(false);
  const [isCc, setIsCc] = useState(false);
  const [isGd, setIsGd] = useState(false);
  const [isBg, setIsBG] = useState(false);

  const fields = chefServiceFields;
  const startingPrice = useMemo(
    () => fields.find((field) => field.id === 'starting_price')!,
    [fields]
  );
  const minGuest = useMemo(
    () => fields.find((field) => field.id === 'minimum_number_of_guests')!,
    [fields]
  );
  const [startPrice, setStartingPrice] = useState('');
  const [minNoGuest, setMinNoGuest] = useState('');

  return (
    <div className="flex flex-col gap-5">
      <UserSettingsTitle title={'Profile'} onSave={() => {}} />
      <h1 className="text-lg text-gray-400">
        Activate the services you are avaliable for and activate your preference
      </h1>

      <ToggleCard
        title={'Chef at Home'}
        isOn={isCah}
        onToggle={() => {
          setIsCat(!isCah);
        }}
        underline={true}
      />

      <ToggleCard
        title={'Large Event'}
        isOn={isLe}
        onToggle={() => {
          SetIsLe(!isLe);
        }}
        underline={false}
      />

      <div className="flex flex-row gap-4 w-[70%]">
        <div className="flex-1">
          <ProfileField field={startingPrice} value={startPrice} />
        </div>
        <div className="flex-1">
          <ProfileField
            field={minGuest}
            value={minNoGuest}
            onChange={(e) => {
              setMinNoGuest(e);
            }}
          />
        </div>
      </div>

      <div className="flex-1 w-[70%]">
        <ProfileField
          field={startingPrice}
          value={startPrice}
          onChange={(e) => {
            setStartingPrice(e);
          }}
        />
      </div>
      <ToggleCard
        title={'Meal Prep'}
        isOn={isMp}
        onToggle={() => {
          setIsMp(!isMp);
        }}
        underline={true}
      />

      <ToggleCard
        title={'Cooking Class'}
        isOn={isCc}
        onToggle={() => {
          setIsCc(!isCc);
        }}
        underline={false}
      />

      <ToggleCard
        title={'Gouremt Delivery'}
        isOn={isGd}
        onToggle={() => {
          setIsGd(!isGd);
        }}
        underline={true}
      />

      <ToggleCard
        title={'Boxed Groceries'}
        isOn={isBg}
        onToggle={() => {
          setIsBG(!isBg);
        }}
        underline={false}
      />
    </div>
  );
}
