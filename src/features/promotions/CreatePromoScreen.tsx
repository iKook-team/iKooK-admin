import PageTitle from '../../app/components/page/PageTitle.tsx';
import InputField, {
  DropdownField,
  InputLabel,
  ToggleField
} from '../../app/components/InputField.tsx';
import { useCreatePromoCode } from './domain/usecase.ts';
import { LoadingSpinner } from '../../app/components/LoadingSpinner.tsx';
import { Formik, useFormikContext } from 'formik';
import {
  createPromoDurationFields,
  createPromoFields,
  createPromoMenuFields
} from './domain/fields.ts';
import { Fragment, RefObject, useRef } from 'react';
import { CreatePromoCodeSchema, getCreatePromoInitialValues } from './domain/schema.ts';
import Field from '../../app/domain/field.ts';
import { withZodSchema } from '../../utils/zodValidator.ts';
import { toast } from 'react-toastify';
import { removeFields } from '../../utils/fieldManipulation.ts';
import { CreatePromoCodeRequest } from './domain/dto.ts';
import SearchMenuModal from '../menus/components/SearchMenuModal.tsx';

export default function CreatePromoScreen() {
  const mutation = useCreatePromoCode();
  const modal = useRef<HTMLDialogElement>(null);
  return (
    <Formik
      initialValues={getCreatePromoInitialValues()}
      validate={withZodSchema(CreatePromoCodeSchema)}
      onSubmit={(values, { resetForm }) => {
        const request: CreatePromoCodeRequest = {
          ...removeFields(
            values,
            'has_duration',
            'has_menu',
            'from_date',
            'from_time',
            'to_date',
            'to_time',
            'menu'
          ),
          ...(values.has_duration
            ? {
                start: `${values.from_date}T${values.from_time}`,
                end: `${values.to_date}T${values.to_time}`
              }
            : {}),
          ...(values.has_menu ? { menu: values.menu } : {})
        };
        mutation.mutateAsync(request).then((response) => {
          toast(response.data.message, { type: 'success' });
          resetForm();
        });
      }}
    >
      {({ values, handleSubmit }) => {
        return (
          <form className="max-w-[50rem]" onSubmit={handleSubmit}>
            <PageTitle title="New Promo Code" className="pb-2" />
            {createPromoFields.map((field) => {
              return (
                <Fragment key={field.id}>
                  <Entry {...field} />
                  {field.id === 'has_duration' && values['has_duration'] === true && (
                    <DurationEntries />
                  )}
                  {field.id === 'has_menu' && values['has_menu'] === true && (
                    <Entry {...createPromoMenuFields[0]} modal={modal} />
                  )}
                </Fragment>
              );
            })}
            <button
              className="btn btn-primary w-fit mt-9"
              type="submit"
              disabled={mutation.isPending}
            >
              <LoadingSpinner isLoading={mutation.isPending}>Save Changes</LoadingSpinner>
            </button>
          </form>
        );
      }}
    </Formik>
  );
}

function DurationEntries() {
  return (
    <>
      {Object.keys(createPromoDurationFields).map((row) => (
        <div key={row}>
          <InputLabel title={row} className="!text-lg mt-3" />
          <div className="flex gap-10">
            {createPromoDurationFields[row].map((field) => (
              <Entry key={field.id} {...field} className="w-full" />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function Entry(field: Field & { className?: string; modal?: RefObject<HTMLDialogElement | null> }) {
  const type = field.type;
  const Element = type === 'select' ? DropdownField : type === 'toggle' ? ToggleField : InputField;
  const formik = useFormikContext<Record<string, any>>();
  return (
    <>
      <Element
        id={field.id}
        error={
          formik.touched[field.id] && formik.errors[field.id]
            ? (formik.errors[field.id] as string)
            : undefined
        }
        name={field.id}
        type={field.type}
        label={field.label}
        placeholder={field.placeholder}
        value={formik.values[field.id]}
        onChange={formik.handleChange}
        // @ts-expect-error too lazy to fix
        options={field.options}
        className={
          field.className ? field.className : `mt-4 ${type === 'toggle' ? 'max-w-72 mt-9' : ''}`
        }
        maxLength={field.maxLength}
        min={field.min}
        max={field.max}
        label-class-name="!text-lg"
        onClick={field.modal ? () => field.modal?.current?.showModal() : undefined}
        readOnly={!!field.modal}
      />
      {field.modal && (
        <SearchMenuModal
          ref={field.modal}
          onMenuSelected={(menuId: number) => {
            void formik.setFieldValue('menu', menuId);
          }}
        />
      )}
    </>
  );
}
