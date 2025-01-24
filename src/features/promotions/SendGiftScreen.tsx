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
  const modalRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <Formik
        initialValues={extractInitialValues(SendGiftCardSchema)}
        validate={withZodSchema(SendGiftCardSchema)}
        onSubmit={(values, { resetForm }) => {
          mutation.mutateAsync(values).then(() => {
            toast('Gift card sent successfully', { type: 'success' });
            resetForm();
          });
        }}
      >
        {({ values, touched, errors, handleChange, handleSubmit, setFieldValue }) => {
          return (
            <form className="max-w-[50rem]" onSubmit={handleSubmit}>
              <PageTitle title="Send Gift" />
              <InputField
                label="Select Gift"
                name="gift"
                placeholder="Select giftcard"
                className="mt-4"
                value={values['gift']}
                error={touched['gift'] ? errors['gift'] : undefined}
                onChange={handleChange}
                onClick={() => modalRef.current?.showModal()}
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
              <button
                className="btn btn-primary w-fit mt-[3.3125rem]"
                type="submit"
                disabled={mutation.isPending}
              >
                <LoadingSpinner isLoading={mutation.isPending}>Send Gift</LoadingSpinner>
              </button>
              <SearchPromotionsModal
                ref={modalRef}
                isPurchase={true}
                onPromotionSelected={(promoId: string) => {
                  void setFieldValue('gift', promoId);
                }}
              />
            </form>
          );
        }}
      </Formik>
    </>
  );
}
