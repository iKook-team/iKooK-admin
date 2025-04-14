import { Ref, useRef, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import { Booking } from '../data/model.ts';
import { useUpdateBooking } from '../domain/usecase.ts';
import InputField from '../../../app/components/InputField.tsx';
import { UserType } from '../../users/domain/types.ts';
import { User } from '../../users/data/model.ts';
import SearchUsersModal from '../../users/components/SearchUsersModal.tsx';
import { LoadingSpinner } from '../../../app/components/LoadingSpinner.tsx';
import { toast } from 'react-toastify';
import { capitalize } from '../../../utils/strings.ts';

interface ReAssignBookingModalProps {
  booking: Booking;
  ref: Ref<HTMLDialogElement>;
}

export default function ReAssignBookingModal({ booking, ref }: ReAssignBookingModalProps) {
  const mutation = useUpdateBooking(ref);

  const selectUserModal = useRef<HTMLDialogElement>(null);
  const [chef, setChef] = useState<User>();

  return (
    <PageModal
      ref={ref}
      id="reassign-booking-modal"
      title={
        <>
          Re-Assign <span className="text-jordy-blue capitalize">{booking?.host_name}</span>?
        </>
      }
    >
      <InputField
        label="Chef"
        name="chef"
        placeholder="Select Chef"
        type="text"
        value={chef ? capitalize(`${chef?.first_name} ${chef?.last_name}`) : ''}
        readOnly={true}
        onClick={() => selectUserModal.current?.showModal()}
      />

      <div className="flex justify-center">
        <button
          type="submit"
          className="btn btn-primary mt-10"
          disabled={mutation.isPending}
          onClick={() => {
            if (chef) {
              mutation.mutate({
                id: booking.id,
                data: {
                  chef_id: chef?.id
                }
              });
            } else {
              toast('Please select a chef', { type: 'error' });
            }
          }}
        >
          <LoadingSpinner isLoading={mutation.isPending}>Re-Assign</LoadingSpinner>
        </button>
      </div>
      <SearchUsersModal
        ref={selectUserModal}
        onUserSelected={(user) => {
          setChef(user);
          getCurrentFromRef(selectUserModal)?.close();
        }}
        type={UserType.chef}
      />
    </PageModal>
  );
}
