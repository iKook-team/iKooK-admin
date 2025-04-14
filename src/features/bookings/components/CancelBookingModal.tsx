import { Ref } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import { Booking, BookingStatus } from '../data/model.ts';
import { useUpdateBooking } from '../domain/usecase.ts';

interface CancelBookingModalProps {
  booking: Booking;
  ref: Ref<HTMLDialogElement>;
}

export default function CancelBookingModal({ booking, ref }: CancelBookingModalProps) {
  const mutation = useUpdateBooking(ref);

  return (
    <PageModal
      ref={ref}
      id="cancel-booking-modal"
      title={
        <>
          Cancel Booking for{' '}
          <span className="text-jordy-blue capitalize">{booking?.host_name}</span>?
        </>
      }
    >
      <>
        <h1>Are you sure you want to cancel this menu?</h1>

        <div className="flex gap-4 justify-center">
          <button
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate({ id: booking.id, data: { status: BookingStatus.cancelled } })
            }
            className="btn btn-soft-cream flex border border-primary  mt-3 w-[40%] "
          >
            {mutation.isPending ? 'Cancelling...' : 'Cancel'}
          </button>
          <button
            onClick={() => getCurrentFromRef(ref)?.close()}
            className="btn btn-primary flex  mt-3 w-[40%]"
          >
            Back
          </button>
        </div>
      </>
    </PageModal>
  );
}
