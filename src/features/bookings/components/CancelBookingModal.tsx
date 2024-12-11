import { forwardRef, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { toast } from 'react-toastify';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import { Bookings } from '../data/model.ts';
import { useDeleteBooking, useEditBookingStatus } from '../domain/usecase.ts';

interface CancelBookingModalProps {
  booking: Bookings;
}

const CancelBookingModal = forwardRef<HTMLDialogElement, CancelBookingModalProps>(
  ({ booking }, ref) => {
    const title = 'Cancel Booking for ';
    const status = 'Cancelled';

    const [loading, setLoading] = useState(false);

    const mutation = useEditBookingStatus(booking);
    const onSubmit = async () => {
      if (loading || booking === undefined) {
        return;
      }

      try {
        setLoading(true);

        const response = await mutation.mutateAsync({
          bookingId: booking.id,
          status : status,
        });

        toast(response.data.data, { type: 'success' });
        getCurrentFromRef(ref)?.close();
      } finally {
        setLoading(false);
      }
    };

    return (
      <PageModal
        ref={ref}
        id="suspend-user-modal"
        title={
          <>
            {title}
            <span className="text-jordy-blue capitalize">
              {booking?.user.firstName} {booking?.user.lastName}
            </span>
            ?
          </>
        }
      >
        <>
          <h1>Are you sure you want to cancel this menu?</h1>

          <div className="flex  gap-4 justify-center">
            <button
              disabled={loading}
              onClick={onSubmit}
              className="btn btn-soft-cream flex border border-primary  mt-3 w-[40%] "
            >
              {loading ? 'Cancelling...' : 'Cancel'}
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
);

CancelBookingModal.displayName = 'DeleteBookingModal';

export default CancelBookingModal;
