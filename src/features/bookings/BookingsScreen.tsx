import { useMemo, useRef, useState } from 'react';
import IdCell from '../../app/components/IdCell';
import PageSearchRow from '../../app/components/page/PageSearchRow';
import PageTable from '../../app/components/page/PageTable';
import PageTitle from '../../app/components/page/PageTitle';
import UsernameAndImage from '../users/components/UsernameAndImage.tsx';
import { useFetchBookingsQuery } from './domain/usecase';
import BookingProposalImageStack from './components/BookingProposalImageStack';
import { useNavigate } from 'react-router-dom';
import { Bookings } from './data/model';
import { BookingType } from './domain/types.ts';
import { PageActionItem } from '../../app/components/page/types.ts';
import PageAction from '../../app/components/page/PageAction.tsx';
import ReAssignBookingModal from './components/ReAssignBookingModal.tsx';
import EditBookingStatusModal from './components/EditBookingStatusModal.tsx';
import DeleteBookingModal from './components/DeleteBookingModal.tsx';
import CancelBookingModal from './components/CancelBookingModal.tsx';
import Pills from '../../app/components/Pills.tsx';
import { formatCurrency } from '../../utils/formatter.ts';
import VerificationStatus from '../../app/components/VerificationStatus.tsx';
import { capitalize } from '../../utils/strings.ts';

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
      <Pills
        active={bookingType}
        setActive={setBookingType}
        items={Object.values(BookingType)}
        getLabel={(e) => (e === BookingType.menus ? 'bookings' : e)}
      />
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
                <UsernameAndImage
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
                  : formatCurrency(booking.amount, booking.currency)}
              </td>

              {bookingType === BookingType.menus && (
                <td>
                  <VerificationStatus
                    title={capitalize(booking.status)}
                    circleColor={
                      booking.status === 'completed'
                        ? 'bg-green'
                        : booking.status === 'pending'
                          ? 'bg-primary'
                          : booking.status === 'cancelled'
                            ? 'bg-red-base'
                            : booking.status === 'enquiry'
                              ? 'bg-secondary'
                              : 'bg-jordy-blue'
                    }
                    textColor={
                      booking.status === 'completed'
                        ? 'text-green'
                        : booking.status === 'pending'
                          ? 'text-primary'
                          : booking.status === 'cancelled'
                            ? 'text-red'
                            : booking.status === 'enquiry'
                              ? 'text-secondary'
                              : 'text-jordy-blue'
                    }
                  />
                </td>
              )}
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
