import { UserPageProps, UserType } from '../domain/types.ts';
import UserSettingsTitle from '../components/UserSettingsTitle.tsx';
import InputField from '../../../app/components/InputField.tsx';
import { useMemo } from 'react';
import { chefProfileFields, hostProfileFields } from '../domain/fields.ts';
import Field from '../../../app/domain/field.ts';
import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
          if (field.id === 'first_name' || field.id === 'last_name' || field.id === 'user_name') {
            return null;
          }
          // @ts-expect-error key is a string
          return <ProfileField key={field.id} field={field} value={user[field.id]} />;
        })}
      </form>
    </div>
  );
}

export function ProfileField({
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

export  function MultiSelectDropdown() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const options = ["African", "Modern English", "Italian", "Chinese", "Mexican", "Indian"];


  const toggleSelection = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="w-full ">
      <label className="block text-gray-700 font-medium mb-1">Cuisine type</label>
      <div
        className="relative border border-gray-300 rounded-lg p-2 flex items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2 flex-grow">
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <span
                key={item}
                className="px-2 py-1 text-sm border border-yellow-400 bg-yellow-50 rounded-full"
              >
                {item}
              </span>
            ))
          ) : (
            <span className="text-gray-400">Select cuisine</span>
          )}
        </div>
        <ChevronDown className="ml-auto text-gray-600" size={16} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-md">
          {options.map((option) => (
            <div
              key={option}
              className={`p-2 cursor-pointer ${
                selectedItems.includes(option) ? "bg-yellow-100 font-medium" : "hover:bg-gray-100"
              }`}
              onClick={() => toggleSelection(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
