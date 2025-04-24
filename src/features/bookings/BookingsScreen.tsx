import { useRef, useState } from 'react';
import PageSearchRow from '../../app/components/page/PageSearchRow';
import PageTable from '../../app/components/page/PageTable';
import PageTitle from '../../app/components/page/PageTitle';
import { useFetchBookingsQuery } from './domain/usecase';
import { useNavigate } from 'react-router-dom';
import { Booking } from './data/model';
import { BookingType } from './domain/types.ts';
import { PageActionItem } from '../../app/components/page/types.ts';
import PageAction from '../../app/components/page/PageAction.tsx';
import ReAssignBookingModal from './components/ReAssignBookingModal.tsx';
import EditBookingStatusModal from './components/EditBookingStatusModal.tsx';
import DeleteBookingModal from './components/DeleteBookingModal.tsx';
import CancelBookingModal from './components/CancelBookingModal.tsx';
import Pills from '../../app/components/Pills.tsx';
import BookingsHeader from './components/BookingsHeader.tsx';
import BookingRow from './components/BookingRow.tsx';

export default function BookingsScreen() {
  const {
    bookingType,
    setBookingType,
    isPending,
    error,
    bookings,
    filter,
    setFilter,
    filters,
    query,
    setQuery,
    totalCount,
    page,
    setPage,
    numberOfPages
  } = useFetchBookingsQuery();

  const reassignBookingRef = useRef<HTMLDialogElement>(null);
  const editBookingStatusRef = useRef<HTMLDialogElement>(null);
  const deleteBookingRef = useRef<HTMLDialogElement>(null);
  const cancelBookingRef = useRef<HTMLDialogElement>(null);

  const navigate = useNavigate();

  const [selectedBooking, setSelectedBooking] = useState<Booking>();

  const onAction = (action: PageActionItem, booking: Booking) => {
    setSelectedBooking(booking);

    switch (action.icon) {
      case 'edit':
        navigate(`/bookings/${bookingType}s/${booking.id}`);
        break;
      case 'delete':
        deleteBookingRef.current?.showModal();
        break;
      case 'reset':
        editBookingStatusRef.current?.showModal();
        break;
      case 'remove':
        cancelBookingRef.current?.showModal();
        break;
      case 'check':
        reassignBookingRef.current?.showModal();
        break;
      default:
        console.log(`Action for ${action} triggered`);
        break;
    }
  };

  return (
    <>
      <PageTitle title="Bookings Management" />
      <Pills active={bookingType} setActive={setBookingType} items={Object.values(BookingType)} />
      <PageSearchRow
        className="mt-4 mb-6 w-full"
        search={query}
        onSearch={setQuery}
        dropdown={filter}
        dropdownOptions={filters}
        onDropdown={setFilter}
      />
      <PageTable
        isFetching={isPending}
        emptyMessage={error?.message || (bookings.length == 0 ? 'No bookings found' : undefined)}
        header={<BookingsHeader type={bookingType} />}
        body={bookings.map((booking) => {
          return (
            <BookingRow
              key={booking.id}
              {...booking}
              type={bookingType}
              onClick={() => navigate(`/bookings/${booking.id}?type=${bookingType}`)}
            >
              <td>
                <PageAction
                  items={[
                    { title: 'Edit', icon: 'edit' },
                    { title: 'Change Status', icon: 'reset' },
                    { title: 'Cancel', icon: 'remove' },
                    { title: 'Delete', icon: 'delete' },
                    { title: 'Re-assign', icon: 'check' }
                  ]}
                  onItemClick={(action) => onAction(action, booking)}
                />
              </td>
            </BookingRow>
          );
        })}
        page={page}
        numberOfPages={numberOfPages}
        onPageChange={setPage}
        pageItemCount={bookings.length}
        totalItemCount={totalCount}
      />
      <ReAssignBookingModal ref={reassignBookingRef} booking={selectedBooking!} />
      <EditBookingStatusModal ref={editBookingStatusRef} booking={selectedBooking!} />
      <DeleteBookingModal ref={deleteBookingRef} booking={selectedBooking!} />
      <CancelBookingModal ref={cancelBookingRef} booking={selectedBooking!} />
    </>
  );
}
