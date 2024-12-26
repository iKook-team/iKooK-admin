import { forwardRef, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { toast } from 'react-toastify';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import { Bookings } from '../data/model.ts';
import { useDeleteBooking } from '../domain/usecase.ts';

interface DeleteBookingModalProps {
  booking: Bookings;
}

const DeleteBookingModal = forwardRef<HTMLDialogElement, DeleteBookingModalProps>(
  ({ booking }, ref) => {
    const title = 'Delete Booking for ';

    const [loading, setLoading] = useState(false);

    const mutation = useDeleteBooking();

    const onSubmit = async () => {
      if (loading || booking === undefined) {
        return;
      }

      try {
        setLoading(true);

        const response = await mutation.mutateAsync({
          bookingId: booking.id
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
          <h1>Are you sure you want to delete this booking?</h1>
          <div className="flex  gap-4 justify-center">
            <button
              onClick={onSubmit}
              disabled={loading}
              className="btn btn-soft-cream flex border border-primary  mt-3 w-[40%] "
            >
              {loading ? 'Deleting...' : 'Delete'}
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
);

DeleteBookingModal.displayName = 'DeleteBookingModal';

export default DeleteBookingModal;
