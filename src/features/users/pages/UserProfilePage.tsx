import { UserPageProps, UserType } from '../domain/types.ts';
import UserSettingsTitle from '../components/UserSettingsTitle.tsx';
import InputField from '../../../app/components/InputField.tsx';
import { useMemo } from 'react';
import { chefProfileFields, hostProfileFields } from '../domain/fields.ts';
import Field from '../../../app/domain/field.ts';

export default function UserProfilePage({ user, type }: UserPageProps) {
  const fields = type === UserType.host ? hostProfileFields : chefProfileFields;
  const firstName = useMemo(() => fields.find((field) => field.id === 'first_name')!, [fields]);
  const lastName = useMemo(() => fields.find((field) => field.id === 'last_name')!, [fields]);

  return (
    <div className="flex flex-col items-center justify-center">
      <UserSettingsTitle title="Profile" onSave={() => {}} />
      <form className="flex flex-col gap-4 w-full lg:w-[90%] self-start">
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <ProfileField field={firstName} value={user.first_name} />
          </div>
          <div className="flex-1">
            <ProfileField field={lastName} value={user.last_name} />
          </div>
        </div>
        {fields.map((field) => {
          if (field.id === 'first_name' || field.id === 'last_name') {
            return null;
          }
          // @ts-expect-error key is a string
          return <ProfileField key={field.id} field={field} value={user[field.id]} />;
        })}
      </form>
    </div>
  );
}

function ProfileField({
  field,
  value,
  onChange
}: {
  field: Field;
  value?: string | number | readonly string[] | undefined;
  onChange?: (value: string) => void;
}) {
  return (
    <InputField
      id={field.id}
      label={field.label}
      value={value}
      placeholder={field.placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={field.readonly}
    />
  );
}
