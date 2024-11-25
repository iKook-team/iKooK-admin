import { useMemo } from 'react';
import IdCell from '../../app/components/IdCell';
import PageSearchRow from '../../app/components/page/PageSearchRow';
import PageTable from '../../app/components/page/PageTable';
import PageTitle from '../../app/components/page/PageTitle';
import UserNameAndImage from '../users/components/UserNameAndImage';
import { useFetchBookingsQuery } from './domain/usecase';
import BookingTypeButtonRow from './components/BookingTypeButtonRow';
import BookingProposalImageStack from './components/BookingProposalImageStack';
import PageAction from '../../app/components/page/PageAction.tsx';
import { PageActionItem } from '../../app/components/page/types.ts';
import { Booking } from './data/model.ts';
import { BookingType } from './domain/types.ts';

export default function BookingsScreen() {
  const actionItems = useMemo(
    () => [
      { title: 'Edit', icon: 'edit' },
      { title: 'Change Status', icon: 'reset' },
      { title: 'Delete', icon: 'delete' }
    ],
    []
  );

  const {
    isPending,
    bookings,
    error,
    filter,
    setFilter,
    filters,
    query,
    setQuery,
    bookingType,
    setBookingType,
    totalCount,
    page,
    setPage,
    numberOfPages
  } = useFetchBookingsQuery();

  const header = useMemo(
    () =>
      bookingType === BookingType.enquiries
        ? ['Booking ID', 'User', 'Location', 'Proposals', 'Number Of Guests']
        : ['Booking ID', 'User', 'Chef', 'Menu', 'Amount', 'Booking Status'],
    [bookingType]
  );

  const onAction = (action: PageActionItem, booking?: Booking) => {
    console.log(action, booking);
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
        emptyMessage={error?.message || (bookings?.length == 0 ? 'No bookings found' : undefined)}
        header={
          <tr>
            {header.map((title) => (
              <th key={title} className="text-left">
                {title}
              </th>
            ))}
            <th>
              <PageAction items={actionItems} onItemClick={(action) => onAction(action)} />
            </th>
          </tr>
        }
        body={bookings.map((booking) => {
          return (
            <tr key={booking.id}>
              <td>
                <IdCell id={booking.id} />
              </td>
              <td>
                <UserNameAndImage
                  name={`${booking.user.firstName} ${booking.user.lastName}`}
                  image={booking.user?.photo ? booking?.user?.photo : ''}
                  // image={ booking.chef?.photo ? booking?.chef?.photo  : ""}
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
                  <BookingProposalImageStack proposalList={booking?.proposals} />
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
                  items={actionItems}
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
    </>
  );
}
