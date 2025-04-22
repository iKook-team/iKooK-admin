import InputField, { InputContainer } from '../../../app/components/InputField.tsx';
import { UserType } from '../domain/types.ts';
import MultiSelectDropdown from './MultiSelectDropDown.tsx';
import { chefProfileFields, hostProfileFields } from '../domain/fields.ts';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { adminProfileSchema, chefProfileSchema, userProfileSchema } from '../domain/validators.ts';
import { User } from '../data/model.ts';
import { extractInitialValues } from '../../../utils/zodValidator.ts';
import DragAndDropImage, { DragAndDropImageRef } from './DragAndDropImage.tsx';

interface UserProfileFormProps {
  user?: User;
  type: UserType;
  onSave: (data: FormData) => void;
}

export interface UserProfileFormRef {
  handleSubmit: () => Promise<void>;
}

const UserProfileForm = forwardRef<UserProfileFormRef, UserProfileFormProps>(
  ({ user, type, onSave }, ref) => {
    const imageRef = useRef<DragAndDropImageRef>(null);

    const fields = type === UserType.chef ? chefProfileFields : hostProfileFields;
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
        }
      }),
      [formik]
    );

    return (
      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-2 gap-4 w-full lg:w-[90%] self-start"
      >
        {fields.map((field) => {
          const touched = formik.touched[field.id as keyof typeof formik.touched];
          const error = formik.errors[field.id as keyof typeof formik.errors];
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
              value={formik.values[field.id] || ''}
              onBlur={formik.handleBlur} // ✅ Handles input blur events
              error={
                touched && error
                  ? Array.isArray(error)
                    ? (error as string[]).join(', ')
                    : (error as string)
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
                  value={formik.values.bio || ''}
                  onBlur={formik.handleBlur}
                />
              </div>
            </InputContainer>
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
