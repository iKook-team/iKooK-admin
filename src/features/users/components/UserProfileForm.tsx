import { ChefService, UserType } from '../domain/types.ts';
import {
  adminProfileFields,
  chefProfileFields,
  hostProfileFields,
  newChefProfileFields
} from '../domain/fields.ts';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import {
  adminProfileSchema,
  chefProfileSchema,
  newChefProfileSchema,
  userProfileSchema
} from '../domain/validators.ts';
import { User } from '../data/model.ts';
import { extractInitialValues } from '../../../utils/zodValidator.ts';
import DragAndDropImage, { DragAndDropImageRef } from './DragAndDropImage.tsx';
import countries from '../../../app/assets/raw/countries.json';
import FormField from '../../../app/components/FormField.tsx';
import { getFormikErrorForId } from '../../../utils/formik.ts';

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
          ? user
            ? chefProfileFields
            : newChefProfileFields
          : hostProfileFields;
    const schema =
      type === UserType.admin
        ? adminProfileSchema
        : type === UserType.chef
          ? user
            ? chefProfileSchema
            : newChefProfileSchema
          : userProfileSchema;

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
        reset: () => {
          formik.resetForm();
          imageRef.current?.clearImage();
        }
      }),
      [formik]
    );

    return (
      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-2 gap-8 w-full lg:w-[90%] self-start"
      >
        {fields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange(field.id)}
            className={`${field.id === 'first_name' || field.id === 'last_name' ? '' : 'col-span-2'}`}
            value={formik.values[field.id]}
            error={getFormikErrorForId(formik, field.id)}
            options={
              field.id === 'chef_services'
                ? Object.values(ChefService)
                : field.id === 'country'
                  ? Object.keys(countries)
                  : field.id === 'city' && formik.values.country
                    ? // @ts-expect-error ignore this useless typescript error
                      countries[formik.values.country]
                    : field.id === 'service_type'
                      ? ['Chef', ChefService.boxGrocery]
                      : field.options
            }
          />
        ))}
        <div className="col-span-2 w-full">
          <DragAndDropImage ref={imageRef} />
        </div>
      </form>
    );
  }
);

UserProfileForm.displayName = 'UserProfileForm';

export default UserProfileForm;
