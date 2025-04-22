import PageTitle from '../../app/components/page/PageTitle.tsx';
import InputField from '../../app/components/InputField.tsx';
import { useSendGiftCard } from './domain/usecase.ts';
import { LoadingSpinner } from '../../app/components/LoadingSpinner.tsx';
import { Formik } from 'formik';
import { SendGiftCardSchema } from './domain/schema.ts';
import { extractInitialValues, withZodSchema } from '../../utils/zodValidator.ts';
import { toast } from 'react-toastify';
import SearchPromotionsModal from './components/SearchPromotionsModal.tsx';
import { useRef } from 'react';

export default function SendGiftScreen() {
  const mutation = useSendGiftCard();
  const selectGiftCardRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <Formik
        initialValues={extractInitialValues(SendGiftCardSchema)}
        validate={withZodSchema(SendGiftCardSchema)}
        onSubmit={async (values, { setFieldValue, resetForm }) => {
          try {
            await mutation.mutateAsync(values);
            toast('Gift card sent successfully', { type: 'success' });
            resetForm();
          } catch (error) {
            const errorMessage = (error as any)?.response.data?.error as string;
            if (errorMessage && errorMessage.startsWith('Giftcard was previously sent to')) {
              void setFieldValue('override', true);
            }
          }
        }}
      >
        {({ values, touched, errors, handleChange, handleSubmit, setFieldValue }) => {
          return (
            <>
              <form className="max-w-[50rem]" onSubmit={handleSubmit}>
                <PageTitle title="Send Gift" />
                <InputField
                  label="Select Gift"
                  name="gift"
                  placeholder="Select giftcard"
                  className="mt-4"
                  value={values['gift_card']}
                  error={touched['gift_card'] ? errors['gift_card'] : undefined}
                  onChange={handleChange}
                  onClick={() => selectGiftCardRef.current?.showModal()}
                  readOnly={true}
                />
                <InputField
                  label="Email Address"
                  name="email"
                  placeholder="Enter email address"
                  type="email"
                  className="mt-4"
                  value={values['email']}
                  error={touched['email'] ? errors['email'] : undefined}
                  onChange={handleChange}
                />
                <div className="mt-[3.3125rem]">
                  <button
                    className="btn btn-primary w-fit"
                    type="submit"
                    disabled={mutation.isPending}
                  >
                    <LoadingSpinner isLoading={mutation.isPending}>
                      {values['override'] ? 'Send Gift Again?' : 'Send Gift'}
                    </LoadingSpinner>
                  </button>
                  {values['override'] && (
                    <button
                      className="btn btn-ghost w-fit ml-4"
                      type="button"
                      onClick={() => setFieldValue('override', false)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
              <SearchPromotionsModal
                ref={selectGiftCardRef}
                isPurchase={true}
                onPromotionSelected={(id: number) => {
                  void setFieldValue('gift_card', id);
                }}
              />
            </>
          );
        }}
      </Formik>
    </>
  );
}
