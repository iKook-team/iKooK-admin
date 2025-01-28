import PageTitle from '../../app/components/page/PageTitle.tsx';
import InputField, { DropdownField } from '../../app/components/InputField.tsx';
import { CURRENCIES } from '../../utils/formatter.ts';
import { useCreateGiftCard } from './domain/usecase.ts';
import { LoadingSpinner } from '../../app/components/LoadingSpinner.tsx';
import { Formik } from 'formik';
import { CreateGiftCardSchema } from './domain/schema.ts';
import { extractInitialValues, withZodSchema } from '../../utils/zodValidator.ts';
import { toast } from 'react-toastify';

export default function CreateGiftScreen() {
  const mutation = useCreateGiftCard();
  return (
    <Formik
      initialValues={extractInitialValues(CreateGiftCardSchema)}
      validate={withZodSchema(CreateGiftCardSchema)}
      onSubmit={(values, { resetForm }) => {
        mutation.mutateAsync(values).then(() => {
          toast('Gift card created successfully', { type: 'success' });
          resetForm();
        });
      }}
    >
      {({ values, touched, errors, handleChange, handleSubmit }) => {
        return (
          <form className="max-w-[50rem]" onSubmit={handleSubmit}>
            <PageTitle title="Create Gift" />
            <DropdownField
              label="Currency"
              name="currency"
              placeholder="Select currency"
              options={CURRENCIES}
              className="mt-4"
              value={values['currency']}
              error={touched['currency'] ? errors['currency'] : undefined}
              onChange={handleChange}
            />
            <InputField
              label="Amount"
              name="amount"
              placeholder="Enter amount"
              type="number"
              className="mt-4"
              value={values['amount']}
              error={touched['amount'] ? errors['amount'] : undefined}
              onChange={handleChange}
            />
            <button
              className="btn btn-primary w-fit mt-[3.3125rem]"
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
