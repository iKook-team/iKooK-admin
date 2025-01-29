import { Ref, useRef } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import InputField from '../../../app/components/InputField.tsx';
import { useCreateWithdrawal } from '../domain/usecase.ts';
import { toast } from 'react-toastify';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import { LoadingSpinner } from '../../../app/components/LoadingSpinner.tsx';
import { Formik } from 'formik';
import { extractInitialValues, withZodSchema } from '../../../utils/zodValidator.ts';
import { CreateWithdrawalSchema } from '../domain/schema.ts';
import SearchUsersModal from '../../users/components/SearchUsersModal.tsx';
import { UserType } from '../../users/domain/types.ts';
import { User } from '../../users/data/model.ts';
import { capitalize } from '../../../utils/strings.ts';

type CreateWithdrawalModalProps = {
  ref: Ref<HTMLDialogElement>;
};

export default function CreateWithdrawalModal({ ref }: CreateWithdrawalModalProps) {
  const mutation = useCreateWithdrawal();

  const selectUserModal = useRef<HTMLDialogElement>(null);
  const selectedUser = useRef<User>(null);

  return (
    <PageModal ref={ref} id="create-withdrawal-modal" title="Withdrawal">
      <Formik
        initialValues={extractInitialValues(CreateWithdrawalSchema)}
        validate={withZodSchema(CreateWithdrawalSchema)}
        onSubmit={(values, { resetForm }) => {
          mutation
            .mutateAsync({
              chefId: selectedUser.current!.id,
              amount: values['amount']
            })
            .then(() => {
              toast('Withdrawal request created successfully', { type: 'success' });
              resetForm();
              getCurrentFromRef(ref)?.close();
            });
        }}
      >
        {({ values, touched, errors, setFieldValue, handleChange, handleSubmit }) => {
          return (
            <>
              <form onSubmit={handleSubmit}>
                <InputField
                  label="Chef"
                  name="chef"
                  placeholder="Select Chef"
                  type="text"
                  value={values['chef']}
                  error={touched['chef'] ? errors['chef'] : undefined}
                  onChange={handleChange}
                  readOnly={true}
                  onClick={() => selectUserModal.current?.showModal()}
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
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="btn btn-primary mt-10"
                    disabled={mutation.isPending}
                  >
                    <LoadingSpinner isLoading={mutation.isPending}>Withdraw</LoadingSpinner>
                  </button>
                </div>
              </form>
              <SearchUsersModal
                ref={selectUserModal}
                onUserSelected={(user) => {
                  selectedUser.current = user;
                  setFieldValue('chef', capitalize(`${user.first_name} ${user.last_name}`)).then(
                    () => getCurrentFromRef(selectUserModal)?.close()
                  );
                }}
                type={UserType.chef}
              />
            </>
          );
        }}
      </Formik>
    </PageModal>
  );
}
