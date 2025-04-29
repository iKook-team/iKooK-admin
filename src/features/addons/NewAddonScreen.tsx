import PageBackButton from '../../app/components/page/PageBackButton.tsx';
import PageTitle from '../../app/components/page/PageTitle.tsx';
import { LoadingSpinner } from '../../app/components/LoadingSpinner.tsx';
import { AddonType } from './domain/type.ts';
import { useRef } from 'react';
import DragAndDropImage, { DragAndDropImageRef } from '../users/components/DragAndDropImage.tsx';
import { useFormik } from 'formik';
import { extractInitialValues, withZodSchema } from '../../utils/zodValidator.ts';
import FormField from '../../app/components/FormField.tsx';
import { getFormikErrorForId } from '../../utils/formik.ts';
import countries from '../../app/assets/raw/countries.json';
import { createAddonClientFields, createAddonServiceFields } from './domain/fields.ts';
import { createAddonClientSchema, createAddonServiceSchema } from './domain/validators.ts';
import { formDataFromObject } from '../../utils/apiUtils.ts';
import { useCreateAddon } from './domain/usecase.ts';
import { toast } from 'react-toastify';
import { z } from 'zod';
import SearchAddonsModal from './components/SearchAddonsModal.tsx';

interface NewAddonScreenProps {
  type: AddonType;
}

type FormikValues = z.infer<typeof createAddonClientSchema & typeof createAddonServiceSchema>;

export default function NewAddonScreen({ type }: NewAddonScreenProps) {
  const imageRef = useRef<DragAndDropImageRef>(null);
  const selectClientRef = useRef<HTMLDialogElement>(null);

  const fields = type === AddonType.service ? createAddonServiceFields : createAddonClientFields;
  const schema = type === AddonType.service ? createAddonServiceSchema : createAddonClientSchema;

  const mutation = useCreateAddon(type);

  const formik = useFormik<FormikValues>({
    // @ts-expect-error ignore this useless typescript error
    initialValues: {
      // @ts-expect-error ignore this useless typescript error
      ...extractInitialValues(schema)
    },
    validate: withZodSchema(schema),
    onSubmit: async (values) => {
      const formData = formDataFromObject(values);

      const image = imageRef.current?.getImage();
      if (image) {
        formData.append(type === AddonType.service ? 'image' : 'avatar', image);
      }

      mutation.mutateAsync(formData).then(() => {
        toast(`Successfully created ${type === AddonType.service ? 'addon' : 'client'}`, {
          type: 'success'
        });
        formik.resetForm();
      });
    }
  });

  return (
    <>
      <PageBackButton />
      <PageTitle
        title={type === AddonType.service ? 'New Addon' : 'New Client'}
        className="mt-6 mb-7"
      />

      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-2 gap-4 w-full lg:w-[90%] self-start"
      >
        {fields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            className={`${field.id === 'first_name' || field.id === 'last_name' ? '' : 'col-span-2'}`}
            // @ts-expect-error ignore this useless typescript error
            value={formik.values[field.id]}
            error={getFormikErrorForId(formik, field.id)}
            options={
              field.id === 'country'
                ? Object.keys(countries)
                : field.id === 'city' && formik.values.country
                  ? // @ts-expect-error ignore this useless typescript error
                    countries[formik.values.country]
                  : field.options
            }
            readOnly={field.id === 'client'}
            onClick={field.id === 'client' ? () => selectClientRef.current?.showModal() : undefined}
          />
        ))}
        <div className="col-span-2 w-full">
          <DragAndDropImage ref={imageRef} />
        </div>
      </form>

      <button
        className="btn btn-primary w-fit mt-12"
        disabled={mutation.isPending}
        // @ts-expect-error ignore this useless typescript error
        onClick={formik.handleSubmit}
      >
        <LoadingSpinner isLoading={mutation.isPending}>Save Changes</LoadingSpinner>
      </button>

      {type !== AddonType.client && (
        <SearchAddonsModal
          ref={selectClientRef}
          type={AddonType.client}
          onSelected={(id: number) => formik.setFieldValue('client', id)}
        />
      )}
    </>
  );
}
