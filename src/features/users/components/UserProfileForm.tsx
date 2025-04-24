import InputField, { DropdownField, InputContainer } from '../../../app/components/InputField.tsx';
import { UserType } from '../domain/types.ts';
import MultiSelectDropdown from './MultiSelectDropDown.tsx';
import { adminProfileFields, chefProfileFields, hostProfileFields } from '../domain/fields.ts';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { adminProfileSchema, chefProfileSchema, userProfileSchema } from '../domain/validators.ts';
import { User } from '../data/model.ts';
import { extractInitialValues } from '../../../utils/zodValidator.ts';
import DragAndDropImage, { DragAndDropImageRef } from './DragAndDropImage.tsx';
import countries from '../../../app/assets/raw/countries.json';

interface UserProfileFormProps {
  user?: User;
  type: UserType;
  onSave: (data: FormData) => void;
}

export interface UserProfileFormRef {
  handleSubmit: () => Promise<void>;
  reset: () => void;
}

const UserProfileForm = forwardRef<UserProfileFormRef, UserProfileFormProps>(
  ({ user, type, onSave }, ref) => {
    const imageRef = useRef<DragAndDropImageRef>(null);

    const fields =
      type === UserType.admin
        ? adminProfileFields
        : type === UserType.chef
          ? chefProfileFields
          : hostProfileFields;
    const schema =
      type === UserType.admin
        ? adminProfileSchema
        : type === UserType.chef
          ? chefProfileSchema
          : userProfileSchema;
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>(user?.cuisines || []);
    const [selectedEvents, setSelectedEvents] = useState<string[]>(user?.events || []);

    const formik = useFormik({
      initialValues: {
        // @ts-expect-error ignore this useless typescript error
        ...extractInitialValues(schema),
        ...user
      },
      validationSchema: schema,
      onSubmit: (values) => {
        // remove all file upload fields from data
        const { avatar, identity_document, culinary_certificate, ...data } = values;
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              formData.append(key, item);
            });
          } else if (value) {
            formData.append(key, value as string);
          }
        });

        const image = imageRef.current?.getImage();
        if (image) {
          formData.append('avatar', image);
        }

        onSave(formData);
      }
    });

    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: async () => {
          await formik.validateForm();
          if (formik.isValid) {
            formik.handleSubmit();
          } else {
            Object.keys(formik.errors).forEach((key) => {
              // @ts-expect-error ignore this useless typescript error
              toast(formik.errors[key], { type: 'error' });
            });
          }
        },
        reset: () => formik.resetForm()
      }),
      [formik]
    );

    return (
      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-2 gap-8 w-full lg:w-[90%] self-start"
      >
        {fields.map((field) => {
          const touched = formik.touched[field.id as keyof typeof formik.touched];
          const error = formik.errors[field.id as keyof typeof formik.errors];
          const errorMessage =
            touched && error
              ? Array.isArray(error)
                ? (error as string[]).join(', ')
                : (error as string)
              : undefined;
          if (field.type === 'multiselect') {
            return (
              <InputContainer key={field.id} error={errorMessage} className="col-span-2">
                <MultiSelectDropdown
                  title={field.label!}
                  options={['African', 'Modern English', 'Italian', 'Chinese', 'Mexican', 'Indian']}
                  // @ts-expect-error ignore this useless typescript error
                  value={formik.values[field.id] || ''}
                  onChange={formik.handleChange}
                />
              </InputContainer>
            );
          } else {
            const Field = field.type === 'select' ? DropdownField : InputField;
            return (
              <Field
                key={field.id}
                label={field.label}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
                onChange={formik.handleChange}
                className={`${field.hidden ? 'hidden' : ''} ${field.id === 'first_name' || field.id === 'last_name' ? '' : 'col-span-2'}`}
                // @ts-expect-error ignore this useless typescript error
                value={formik.values[field.id] || ''}
                onBlur={formik.handleBlur}
                error={errorMessage}
                options={
                  field.id === 'country'
                    ? Object.keys(countries)
                    : field.id === 'city' && formik.values.country
                      ? // @ts-expect-error ignore this useless typescript error
                        countries[formik.values.country]
                      : field.options
                }
              />
            );
          }
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
        <div className="col-span-2 w-full">
          <DragAndDropImage ref={imageRef} />
        </div>
      </form>
    );
  }
);

UserProfileForm.displayName = 'UserProfileForm';

export default UserProfileForm;
