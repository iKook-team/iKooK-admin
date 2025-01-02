import { useMemo, useRef, useState } from 'react';
import IdCell from '../../app/components/IdCell';
import PageSearchRow from '../../app/components/page/PageSearchRow';
import PageTable from '../../app/components/page/PageTable';
import PageTitle from '../../app/components/page/PageTitle';
import UserNameAndImage from '../users/components/UserNameAndImage';
import { useFetchBookingsQuery } from './domain/usecase';
import BookingTypeButtonRow from './components/BookingTypeButtonRow';
import BookingProposalImageStack from './components/BookingProposalImageStack';
import { useNavigate } from 'react-router-dom';
import { Bookings } from './data/model';
import { BookingType } from './domain/types.ts';
import { PageActionItem } from '../../app/components/page/types.ts';
import PageAction from '../../app/components/page/PageAction.tsx';
import ReAssignBookingModal from './components/ReAssignBookingModal.tsx';
import EditBookingStatusModal from './components/ChangeStatusModal.tsx';
import DeleteBookingModal from './components/DeleteBookingModal.tsx';
import CancelBookingModal from './components/CancelBookingModal.tsx';

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

  const [selectedBooking, setSelectedBooking] = useState<Bookings>();

  const header = useMemo(
    () =>
      bookingType === BookingType.enquiries
        ? ['Booking ID', 'User', 'Location', 'Proposals', 'Number Of Guests']
        : ['Booking ID', 'User', 'Chef', 'Menu', 'Amount', 'Booking Status'],
    [bookingType]
  );


  const onAction = (action: PageActionItem, booking: Bookings) => {
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
      <BookingTypeButtonRow activeButton={bookingType} setBookingType={setBookingType} />
      <PageSearchRow
        className="mt-4 mb-6 w-full"
        search={query}
        onSearch={setQuery}
        dropdown={filter}
        dropdownOptions={filters}
        onDropdown={setFilter}
        button="New Booking"
      />
      <PageTable
        isFetching={isPending}
        emptyMessage={error?.message || (bookings.length == 0 ? 'No bookings found' : undefined)}
        header={
          <tr>
            {header.map((title) => (
              <th key={title} className="text-left">
                {title}
              </th>
            ))}
          </tr>
        }
        body={bookings.map((booking) => {
          const proposalList = booking?.proposals;
          return (
            <tr
              key={booking.id}
              onClick={() => navigate(`/bookings/${bookingType}s/${booking.id}`, {})}
              className="cursor-pointer hover:bg-gray-100"
            >
              <td>
                <IdCell id={booking.id} />
              </td>
              <td>
                <UserNameAndImage
                  name={`${booking.user.firstName} ${booking.user.lastName}`}
                  image={booking.user?.photo ? booking?.user?.photo : ''}
                />
              </td>
              <td className="capitalize">
                {bookingType === BookingType.enquiries
                  ? booking.country
                  : booking.chef?.photo
                    ? `chef ${booking.chef?.firstName}`
                    : ''}
              </td>

              <td>
                {bookingType === BookingType.enquiries ? (
                  <BookingProposalImageStack proposalList={proposalList} />
                ) : (
                  booking.menu
                )}
              </td>

              <td>
                {bookingType === BookingType.enquiries
                  ? booking.number_of_guest
                  : `€${booking.amount}`}
              </td>

              {bookingType === BookingType.menus && <td> {booking.status}</td>}
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
            </tr>
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
