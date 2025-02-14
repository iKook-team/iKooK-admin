import { Ref, useEffect, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { toast } from 'react-toastify';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import { Bookings } from '../data/model.ts';
import { useEditBookingStatus } from '../domain/usecase.ts';
import { DropdownField } from '../../../app/components/InputField.tsx';

interface EditBookingStatusProps {
  booking: Bookings;
  ref: Ref<HTMLDialogElement>;
}

export default function EditBookingStatusModal({ booking, ref }: EditBookingStatusProps) {
  const statuses = ['cancelled', 'completed', 'enquiry', 'pending', 'processing'];

  const [status, setStatus] = useState(booking?.status);

  useEffect(() => {
    setStatus(booking?.status);
  }, [booking?.status]);

  const title = 'Change Status for ';

  const [loading, setLoading] = useState(false);

  const mutation = useEditBookingStatus();

  const onSubmit = async () => {
    if (loading || booking === undefined) {
      return;
    }

    try {
      setLoading(true);

      const response = await mutation.mutateAsync({
        bookingId: booking.id,
        status: status
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
      id="edit-booking-status-modal"
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
      <div>
        <DropdownField
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
          }}
          options={statuses || []}
        />
        <button
          onClick={onSubmit}
          disabled={loading}
          className="btn btn-primary flex mx-auto mt-3 w-32"
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </div>
    </PageModal>
  );
}
