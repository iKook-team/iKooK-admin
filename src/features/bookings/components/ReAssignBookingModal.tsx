import { forwardRef, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { toast } from 'react-toastify';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import { Bookings } from '../data/model.ts';
import { useReassignBooking } from '../domain/usecase.ts';
import InputField from '../../../app/components/InputField.tsx';
import { useFetchUsersQuery } from '../../users/domain/usecase.ts';
import { UserType } from '../../users/domain/types.ts';
import { FaSearch } from 'react-icons/fa';

interface ReAssignBookingModalProps {
  booking: Bookings;

}

const ReAssignBookingModal = forwardRef<HTMLDialogElement, ReAssignBookingModalProps>(
    
  ({ booking}, ref) => {

    const [query, setQuery] = useState<string>();

    const [chefId, setChefId] = useState('');


    const {
      isPending: loadingChefs,
      users,
      error
    } = useFetchUsersQuery({
      type: UserType.chef,
      query
    });
    
    const title = 'Re-Assign';

    const [loading, setLoading] = useState(false);

    const mutation = useReassignBooking( booking);

    const onSubmit = async () => {
      if (loading || booking === undefined) {
        return;
      }

      try {
        setLoading(true);

        const response = await mutation.mutateAsync({
          chefId: chefId,
          bookingId: booking.id,
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
            {title}{' '}
            <span className="text-jordy-blue capitalize">
              {booking?.user.firstName} {booking?.user.lastName}
            </span>
            ?
          </>
        }
      >
         <div>
      <div>Select Chef</div>
      <InputField
        className="w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name of Chef"
        trailing={<FaSearch />}
      />
      {loadingChefs && <span className="loading loading-dots loading-lg"></span>}
      {error && <p>{error.message}</p>}

      <ul className="mt-2">
        {users.map((chef, index) => (
          <li key={index}>
            <div
              className="text-center border border-black bg-primary mb-1 font-bold cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setQuery(chef.first_name + ' ' + chef.last_name);
                setChefId(chef.id);
                console.log('set chef id ');
              }}
            >
              {chef.last_name} {chef.first_name}
            </div>
          </li>
        ))}
      </ul>

      <button
        disabled={loading}
        onClick={onSubmit}
        className="btn btn-primary flex mx-auto mt-3 w-32"
      >
        {loading ? 'Assigning' : 'Assign'}
      </button>
    </div>
      </PageModal>
    );
  }
);

ReAssignBookingModal.displayName = 'ReAssignBookingModal';

export default ReAssignBookingModal;
