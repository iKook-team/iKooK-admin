import { UserPageProps, UserType } from '../domain/types.ts';
import UserSettingsTitle from '../components/UserSettingsTitle.tsx';
import InputField, { InputContainer } from '../../../app/components/InputField.tsx';
import { useState } from 'react';
import { chefProfileFields, hostProfileFields } from '../domain/fields.ts';
import Field from '../../../app/domain/field.ts';
import MultiSelectDropdown from '../components/MultiSelectDropDown.tsx';
import DragAndDropImage from '../components/ImageDraggable.tsx';
import { useFormik } from 'formik';
import { chefProfileSchema, userProfileSchema } from '../domain/validators.ts';
import { useUpdateUser } from '../domain/usecase.ts';
import { toast } from 'react-toastify';

export default function UserProfilePage({ user, type }: UserPageProps) {
  const fields = type === UserType.host ? hostProfileFields : chefProfileFields;
  const mutation = useUpdateUser(type);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(user.cuisines || []);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(user.events || []);

  const onSave = async () => {
    await formik.validateForm();
    if (formik.isValid) {
      formik.handleSubmit();
    } else {
      Object.keys(formik.errors).forEach((key) => {
        toast(formik.errors[key as keyof typeof formik.errors], { type: 'error' });
      });
    }
  };

  const formik = useFormik({
    initialValues: user,
    validationSchema: type === UserType.host ? userProfileSchema : chefProfileSchema,
    onSubmit: (values) => {
      // remove all file upload fields from data
      const { avatar, identity_document, culinary_certificate, ...data } = values;
      mutation
        .mutateAsync({
          id: user.id,
          data
        })
        .then(() => toast(`${type} profile edited successfully`, { type: 'success' }));
    }
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <UserSettingsTitle title="Profile" onSave={onSave} loading={mutation.isPending} />
      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-2 gap-4 w-full lg:w-[90%] self-start"
      >
        {fields.map((field) => {
          return (
            <InputField
              key={field.id}
              label={field.label}
              name={field.id}
              type={field.type}
              placeholder={field.placeholder}
              onChange={formik.handleChange}
              className={`mb-4 ${field.hidden ? 'hidden' : ''} ${field.id === 'first_name' || field.id === 'last_name' ? '' : 'col-span-2'}`}
              // @ts-expect-error ignore this useless typescript error
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
          <div className="col-span-2 flex flex-col gap-5">
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
                  value={selectedCuisines}
                  onChange={setSelectedCuisines}
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
                  onChange={setSelectedEvents}
                  title="Events avaliable for"
                  options={['Wedding', 'Birthday', 'Party']}
                  value={selectedEvents}
                />
              </InputContainer>
            </div>
          </div>
        )}
        {type === UserType.host && (
          <div className="col-span-2">
            <InputContainer
              label={'Brief description'}
              error={formik.touched.bio && formik.errors.bio ? formik.errors.bio : undefined}
            >
              <div className="border-b" />
              <div className="h-[200px] items-stretch">
                <textarea
                  key="bio"
                  name="bio"
                  className={`h-full w-full input input-bordered p-3 ${formik.errors.bio ? 'input-error' : ''}`}
                  placeholder="John Smith was born in a small town in the Midwest. He grew up with a love of learning and a passion for science and technology. After graduating from high school, he attended a prestigious university where he earned a degree in electrical engineering. He then landed a job at a top technology company, where he quickly rose through the ranks to become a lead engineer.John has always been an innovator, and he is known for his ability to think outside the box and come up with new, creative solutions to complex problems. He has been credited with several patents for his inventions and is respected throughout the industry for his technical expertise and leadership skills."
                  onChange={formik.handleChange}
                  value={formik.values.bio}
                  onBlur={formik.handleBlur}
                />
              </div>
            </InputContainer>
          </div>
        )}
        {type === UserType.host && (
          <div className="col-span-2 w-full">
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
  onChange,
  className
}: {
  field: Field;
  value?: string | number | readonly string[] | undefined;
  onChange?: (value: string) => void;
  className?: string;
}) {
  return (
    <InputField
      id={field.id}
      label={field.label}
      value={value}
      placeholder={field.placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={field.readonly}
      className={className}
    />
  );
}
