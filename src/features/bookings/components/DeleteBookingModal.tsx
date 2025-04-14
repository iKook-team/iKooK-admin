import { Ref } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import { Booking } from '../data/model.ts';
import { useDeleteBooking } from '../domain/usecase.ts';

interface DeleteBookingModalProps {
  booking: Booking;
  ref: Ref<HTMLDialogElement>;
}

export default function DeleteBookingModal({ booking, ref }: DeleteBookingModalProps) {
  const mutation = useDeleteBooking(ref);

  return (
    <PageModal
      ref={ref}
      id="delete-booking-modal"
      title={
        <>
          Delete Booking for{' '}
          <span className="text-jordy-blue capitalize">{booking?.host_name}</span>?
        </>
      }
    >
      <>
        <h1>Are you sure you want to delete this booking?</h1>
        <div className="flex  gap-4 justify-center">
          <button
            onClick={() => mutation.mutate({ id: booking.id })}
            disabled={mutation.isPending}
            className="btn btn-soft-cream flex border border-primary  mt-3 w-[40%] "
          >
            {mutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={() => getCurrentFromRef(ref)?.close()}
            className="btn btn-primary flex  mt-3 w-[40%]"
          >
            Cancel
          </button>
        </div>
      </>
    </PageModal>
  );
}
