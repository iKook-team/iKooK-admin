import { Ref, useEffect, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { Booking, BookingStatus } from '../data/model.ts';
import { useUpdateBooking } from '../domain/usecase.ts';
import { DropdownField } from '../../../app/components/InputField.tsx';

interface EditBookingStatusProps {
  booking: Booking;
  ref: Ref<HTMLDialogElement>;
}

export default function EditBookingStatusModal({ booking, ref }: EditBookingStatusProps) {
  const [status, setStatus] = useState<BookingStatus>(booking?.status);
  const mutation = useUpdateBooking(ref);

  useEffect(() => {
    setStatus(booking?.status);
  }, [booking?.status]);

  return (
    <PageModal
      ref={ref}
      id="edit-booking-status-modal"
      title={
        <>
          Change Status for <span className="text-jordy-blue capitalize">{booking?.host_name}</span>
          ?
        </>
      }
    >
      <div>
        <DropdownField
          value={status}
          onChange={(e) => setStatus(e.target.value as BookingStatus)}
          options={Object.values(BookingStatus)}
        />
        <button
          onClick={() => mutation.mutate({ id: booking.id, data: { status: status } })}
          disabled={mutation.isPending}
          className="btn btn-primary flex mx-auto mt-3 w-32"
        >
          {mutation.isPending ? 'Updating...' : 'Update'}
        </button>
      </div>
    </PageModal>
  );
}
