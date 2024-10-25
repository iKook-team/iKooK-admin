import { useMemo, useState } from 'react';
import IdCell from '../../app/components/IdCell';
import PageSearchRow from '../../app/components/page/PageSearchRow';
import PageTable, { PageTableAction, PageTableActions } from '../../app/components/page/PageTable';
import PageTitle from '../../app/components/page/PageTitle';
import UserNameAndImage from '../users/components/UserNameAndImage';
import { useFetchBookingsQuery } from './domain/usecase';
import BookingTypeButtonRow from './components/BookingTypeButtonRow';
import BookingProposalImageStack from './components/BookingProposalImageStack';

export default function BookingsScreen() {
  const bookingTypes = useMemo(() => ['menu', 'enquiries'], []);

  const [bookingType, setBookingType] = useState<string>(bookingTypes[1]);

  const header = useMemo(
    () =>
      bookingType === bookingTypes[1]
        ? ['Booking ID', 'User', 'Location', 'Proposals', 'Number Of Guests']
        : ['Booking ID', 'User', 'Chef', 'Menu', 'Amount', 'Booking Status'],
    [bookingType, bookingTypes]
  );

  const dropdown = useMemo(
    () => [
      { title: 'Edit', icon: 'edit' },
      { title: 'Change Status', icon: 'reset' },
      { title: 'Delete', icon: 'delete' }
    ],
    []
  );

  const filters = useMemo(() => ['all', 'in progress', 'completed', 'pending'], []);

  const [query, setQuery] = useState<string>();
  const [filter, setFilter] = useState<string>(filters[0]);

  const { isPending, bookings, error } = useFetchBookingsQuery({
    bookingType: bookingType,
    query
  });

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
            <th>
              <PageTableActions>
                {dropdown.map((entry) => (
                  <PageTableAction
                    key={entry.title}
                    icon={entry.icon}
                    text={entry.title}
                    onClick={() => {}}
                  />
                ))}
              </PageTableActions>
            </th>
          </tr>
        }
        body={bookings.map((booking) => {
          const proposalList = booking?.proposals;
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
                {bookingType === bookingTypes[1]
                  ? booking.country
                  : booking.chef?.photo
                    ? `chef ${booking.chef?.firstName}`
                    : ''}
              </td>

              <td>
                {bookingType === bookingTypes[1] ? (
                  <BookingProposalImageStack proposalList={proposalList} />
                ) : (
                  booking.menu
                )}
              </td>

              <td>
                {bookingType === bookingTypes[1] ? booking.number_of_guest : `€${booking.amount}`}
              </td>

              {bookingType === bookingTypes[0] && <td> {booking.status}</td>}
              <td>
                <PageTableActions>
                  {dropdown.map((entry) => (
                    <PageTableAction
                      key={entry.title}
                      icon={entry.icon}
                      text={entry.title}
                      onClick={() => {}}
                    />
                  ))}
                </PageTableActions>
              </td>
            </tr>
          );
        })}
        page={1}
        numberOfPages={1}
        onPageChange={() => {}}
        pageItemCount={bookings.length}
        totalItemCount={bookings.length}
      />
    </>
  );
}
