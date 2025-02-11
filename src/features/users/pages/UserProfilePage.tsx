import { UserPageProps, UserType } from '../domain/types.ts';
import UserSettingsTitle from '../components/UserSettingsTitle.tsx';
import InputField, { InputContainer } from '../../../app/components/InputField.tsx';
import { FormEvent, useMemo, useState } from 'react';
import { chefProfileFields, hostProfileFields } from '../domain/fields.ts';
import Field from '../../../app/domain/field.ts';
import { MultiSelectDropdown } from '../components/MultiSelectDropDown.tsx';
import DragAndDropImage from '../components/ImageDraggable.tsx';
import { useFormik } from 'formik';
import { userProfileSchema } from '../domain/validators.ts';
import { useEditProfile } from '../domain/usecase.ts';
import { toast } from 'react-toastify';

export default function UserProfilePage({ user, type }: UserPageProps) {
  const fields = type === UserType.host ? hostProfileFields : chefProfileFields;
  const firstName = useMemo(() => fields.find((field) => field.id === 'first_name'), [fields]);
  const lastName = useMemo(() => fields.find((field) => field.id === 'last_name'), [fields]);
  const { editProfile } = useEditProfile(type);
  const [editing, setEditing] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);


  async function saveProfileChange(values: any) {
    if (editing === true) {
      return;
    }
    try {
      setEditing(true);
      console.log(values);

      await editProfile({
        first_name: values.first_name,
        last_name: values.last_name,
        date_of_birth: values.date_of_birth,
        state: values.state,
        city: values.city,
        address: values.address,
        post_code: values.postcode,
        experience: values.experience,
        cuisines: values.cuisines,
        events: values.events,
        weekly_charges: 0,
        monthly_charges: 0
      });
      toast(`${type} profile edited successfully`, { type: 'success' });
    } finally {
      setEditing(false);
    }
    console.log(values);
  }

  const onSave = async () => {
    await formik.validateForm();
    if (formik.isValid) {
      formik.handleSubmit();
    } else {
      // e.preventDefault();
      Object.keys(formik.errors).forEach((key) => {
        toast(formik.errors[key as keyof typeof formik.errors], { type: 'error' });
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      email: user.email || '',
      mobile: user.mobile || '',
      brief_info: '',
      country: '',
      brief_profile: '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      date_of_birth: '',
      state: '',
      city: '',
      address: user.address,
      postcode: '',
      experience: '',
      cuisines: selectedCuisines,
      events: [],
      weekly_charges: 0,
      monthly_charges: 0
    },
    validationSchema: userProfileSchema,
    onSubmit: (values) => saveProfileChange(values)
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <UserSettingsTitle title="Profile" onSave={onSave} />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-4 w-full lg:w-[90%] self-start"
      >
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            {firstName && (
              <InputField
                name={firstName.id}
                key={firstName.id}
                label={firstName.label}
                error={
                  formik.touched.first_name && formik.errors.first_name
                    ? formik.errors.first_name
                    : undefined
                }
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            )}
          </div>
          <div className="flex-1">
            {lastName && (
              <InputField
                name={lastName.id}
                key={lastName.id}
                label={lastName.label}
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.last_name && formik.errors.last_name
                    ? formik.errors.last_name
                    : undefined
                }
              />
            )}
          </div>
        </div>
        {fields.map((field) => {
          if (field.id === 'first_name' || field.id === 'last_name' || field.id === 'user_name') {
            return null;
          }
          return (
            <InputField
              key={field.id}
              label={field.label}
              name={field.id}
              type={field.type}
              placeholder={field.placeholder}
              onChange={formik.handleChange}
              className={`mb-4 ${field.hidden ? 'hidden' : ''}`}
              value={formik.values[field.id as keyof typeof formik.values]}
              onBlur={formik.handleBlur} // ✅ Handles input blur events
              error={
                formik.touched[field.id as keyof typeof formik.touched] &&
                formik.errors[field.id as keyof typeof formik.errors]
                  ? Array.isArray(formik.errors[field.id as keyof typeof formik.errors])
                    ? (formik.errors[field.id as keyof typeof formik.errors] as string[]).join(', ')
                    : (formik.errors[field.id as keyof typeof formik.errors] as string)
                  : undefined
              }
            />
          );
        })}
        {type === UserType.chef && (
          <div className="flex flex-col gap-5">
            <div>
              <InputContainer
                error={
                  formik.touched.cuisines && formik.errors.cuisines
                    ? Array.isArray(formik.errors.cuisines)
                      ? formik.errors.cuisines.join(', ')
                      : formik.errors.cuisines
                    : undefined
                }
              >
                <MultiSelectDropdown
                  title="Cuisines I can cook"
                  options={['African', 'Modern English', 'Italian', 'Chinese', 'Mexican', 'Indian']}
                  value={formik.values.cuisines}
                  onChange={
                     setSelectedCuisines}
                />
              </InputContainer>
            </div>
            <div>
              <InputContainer
                error={
                  formik.touched.cuisines && formik.errors.cuisines
                    ? Array.isArray(formik.errors.cuisines)
                      ? formik.errors.cuisines.join(', ')
                      : formik.errors.cuisines
                    : undefined
                }
              >
                <MultiSelectDropdown
                  onChange={formik.handleChange}
                  title="Events avaliable for"
                  options={['Wedding', 'birthday', 'Party']}
                  value={formik.values.events}
                />
              </InputContainer>
            </div>
          </div>
        )}
        {type === UserType.host && (
          <div>
            <InputContainer
              label={'Brief description'}
              error={
                formik.touched.brief_info && formik.errors.brief_info
                  ? formik.errors.brief_info
                  : undefined
              }
            >
              <div className="border-b  "></div>
              <div className="h-[200px] items-stretch  ">
                <textarea
                  key={'brief_info'}
                  name={'brief_info'}
                  className={`h-full w-full input input-bordered p-3 ${formik.errors.brief_info ? 'input-error' : ''}`}
                  placeholder="John Smith was born in a small town in the Midwest. He grew up with a love of learning and a passion for science and technology. After graduating from high school, he attended a prestigious university where he earned a degree in electrical engineering. He then landed a job at a top technology company, where he quickly rose through the ranks to become a lead engineer.John has always been an innovator, and he is known for his ability to think outside the box and come up with new, creative solutions to complex problems. He has been credited with several patents for his inventions and is respected throughout the industry for his technical expertise and leadership skills."
                  onChange={formik.handleChange}
                  value={formik.values.brief_info}
                  onBlur={formik.handleBlur}
                />
              </div>
            </InputContainer>
          </div>
        )}
        {type === UserType.host && (
          <div className=" w-full">
            <DragAndDropImage />
          </div>
        )}
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
