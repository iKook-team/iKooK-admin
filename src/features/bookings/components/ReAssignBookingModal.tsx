import { Ref, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { toast } from 'react-toastify';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import { Bookings } from '../data/model.ts';
import { useReassignBooking } from '../domain/usecase.ts';
import InputField from '../../../app/components/InputField.tsx';
import { useFetchUsersQuery } from '../../users/domain/usecase.ts';
import { UserType } from '../../users/domain/types.ts';
import { FaSearch } from 'react-icons/fa';
import { PaginationControls } from '../../../app/components/page/PageTable.tsx';

interface ReAssignBookingModalProps {
  booking: Bookings;
  ref: Ref<HTMLDialogElement>;
}

export default function ReAssignBookingModal({ booking, ref }: ReAssignBookingModalProps) {
  const [chefId, setChefId] = useState('');

  const {
    isPending: loadingChefs,
    users,
    error,
    query,
    setQuery,
    page,
    setPage,
    numberOfPages,
    totalCount
  } = useFetchUsersQuery({
    type: UserType.chef
  });

  const title = 'Re-Assign';

  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(true);

  const mutation = useReassignBooking();

  const onSubmit = async () => {
    if (loading || booking === undefined) {
      return;
    }

    try {
      setLoading(true);

      const response = await mutation.mutateAsync({
        chefId: chefId,
        bookingId: booking.id
      });

      toast(response.data.data, { type: 'success' });
      getCurrentFromRef(ref)?.close();
    } finally {
      setLoading(false);
      setQuery('');
      setChefId('');
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
        <div className="mb-2">Select Chef</div>
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
                className="text-center border border-black-base bg-primary mb-1 font-bold cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setQuery(chef.last_name + ' ' + chef.first_name);
                  setChefId(chef.id);
                  setLoadingId(false);
                  console.log(`set chef id ${chefId} and booking id ${booking.id}`);
                }}
              >
                {chef.last_name} {chef.first_name}
              </div>
            </li>
          ))}
        </ul>

        <PaginationControls
          page={page}
          numberOfPages={numberOfPages}
          onPageChange={setPage}
          totalItemCount={totalCount}
          pageItemCount={users.length}
        />

        <button
          disabled={loading || loadingId}
          onClick={onSubmit}
          className="btn btn-primary flex mx-auto mt-3 w-32"
        >
          {loading ? 'Assigning' : 'Assign'}
        </button>
      </div>
    </PageModal>
  );
}
