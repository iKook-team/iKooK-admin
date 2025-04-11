import { Ref, useRef } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { toast } from 'react-toastify';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import { Booking } from '../data/model.ts';
import { useReassignBooking } from '../domain/usecase.ts';
import InputField from '../../../app/components/InputField.tsx';
import { UserType } from '../../users/domain/types.ts';
import { User } from '../../users/data/model.ts';
import SearchUsersModal from '../../users/components/SearchUsersModal.tsx';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LoadingSpinner } from '../../../app/components/LoadingSpinner.tsx';
import { capitalize } from '../../../utils/strings.ts';

interface ReAssignBookingModalProps {
  booking: Booking;
  ref: Ref<HTMLDialogElement>;
}

export default function ReAssignBookingModal({ booking, ref }: ReAssignBookingModalProps) {
  const mutation = useReassignBooking();

  const selectUserModal = useRef<HTMLDialogElement>(null);
  const selectedUser = useRef<User>(null);

  const title = 'Re-Assign';

  return (
    <PageModal
      ref={ref}
      id="reassign-booking-modal"
      title={
        <>
          {title}
          <span className="text-jordy-blue capitalize">{' ' + booking?.host_name}</span>?
        </>
      }
    >
      <Formik
        initialValues={{ chef: '' }}
        validationSchema={Yup.object({
          chef: Yup.string().required('Chef is required')
        })}
        onSubmit={(values) => {
          console.log(values);
          mutation
            .mutateAsync({
              chefId: selectedUser.current!.id,
              bookingId: booking.id
            })
            .then(() => {
              console.log('done');
              toast('Re-Assign Successful', { type: 'success' });
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

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="btn btn-primary mt-10"
                    disabled={mutation.isPending}
                  >
                    <LoadingSpinner isLoading={mutation.isPending}>Re-Assign</LoadingSpinner>
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
