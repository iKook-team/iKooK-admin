import { useMemo, useState } from 'react';
import IdCell from '../../app/components/IdCell';
import PageSearchRow from '../../app/components/page/PageSearchRow';
import PageTable, { PageTableAction, PageTableActions } from '../../app/components/page/PageTable';
import PageTitle from '../../app/components/page/PageTitle';
import UserNameAndImage from '../users/components/UserNameAndImage';
import {
  useDeleteBooking,
  useEditBookingStatus,
  useFetchBookingsQuery,
} from './domain/usecase';
import BookingTypeButtonRow from './components/BookingTypeButtonRow';
import BookingProposalImageStack from './components/BookingProposalImageStack';
import { useNavigate } from 'react-router-dom';
import Modal from './components/BookingsModal';
import { DropdownField } from '../../app/components/InputField';
import { Bookings } from './data/model';
import ReAssignSearchComponent from './components/ReAssignBooking';


export default function BookingsScreen() {
  const {
    bookingType,
    setBookingType,
    bookingTypes,
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

  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const statuses = ['Cancelled', 'Completed', 'Enquiry', 'Pending', 'Processing'];
  const [status, setStatus] = useState(statuses[0]);
  const [currentBookingId, setCurrentBookingId] = useState('');
  const [currentChefId, setCurrentChefId] = useState('');
  // const assignments = ['Cancelled', 'Completed', 'Enquiry', 'Pending', 'Processing'];
  // const [assign, setAssign] = useState(assignments[0]);

  const closeModal = () => setIsModalVisible(false);

  interface ModalProps {
    modalTitle: string;
    status: string;
    statuses: string[];
  }

  const ModalContent: React.FC<ModalProps> = ({ modalTitle, status, statuses }) => {
    const { performDelete, loading: deleteLoading } = useDeleteBooking();

    const { performEditStatus, loading: statusLoading } = useEditBookingStatus();

    const modalChildren =
      modalTitle === 'Delete' ? (
        <>
          <h1>Are you sure you want to delete this menu?</h1>
          <div className="flex  gap-4 justify-center">
            <button
              onClick={() => {
                currentBookingId && performDelete(currentBookingId).then(() => closeModal());
              }}
              disabled={deleteLoading}
              className="btn btn-soft-cream flex border border-primary  mt-3 w-[40%] "
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
            <button onClick={closeModal} className="btn btn-primary flex  mt-3 w-[40%]">
              Cancel
            </button>
          </div>
        </>
      ) : modalTitle === 'Cancel' ? (
        <>
          <h1>Are you sure you want to cancel this menu?</h1>

          <div className="flex  gap-4 justify-center">
            <button
              disabled={statusLoading}
              onClick={() => {
                performEditStatus(currentBookingId, statuses[0]).then(() => closeModal());
              }}
              className="btn btn-soft-cream flex border border-primary  mt-3 w-[40%] "
            >
              {statusLoading ? 'Cancelling...' : 'Cancel'}
            </button>
            <button onClick={closeModal} className="btn btn-primary flex  mt-3 w-[40%]">
              Back
            </button>
          </div>
        </>
      ) : modalTitle === 'Re-assign' ? (
          <ReAssignSearchComponent/>
      ) :
       
      modalTitle === 'Change Status' ? (
        <div>
          <DropdownField
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
            options={statuses || []}
          />
          <button
            onClick={() => {
              performEditStatus(currentBookingId, status).then(() => closeModal());
            }}
            disabled={statusLoading}
            className="btn btn-primary flex mx-auto mt-3 w-32"
          >
            {statusLoading ? 'Updating...' : 'Update'}
          </button>
        </div>
      ) : (
        <div></div>
      );

    return <div>{modalChildren}</div>;
  };

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
      { title: 'Cancel', icon: 'close' },
      { title: 'Delete', icon: 'delete' },
      { title: 'Re-assign', icon: 'check' }
    ],
    []
  );

  const handleClick = (entry: string, booking: Bookings): void => {
    setIsModalVisible(true);
    setCurrentBookingId(booking.id);
    setCurrentChefId(booking.id); // come back to set chefId here

    switch (entry) {
      case 'Edit':
        navigate(`/bookings/${bookingType}s/${booking.id}`);
        break;
      case 'Delete':
        setModalTitle('Delete');
        break;
      case 'Change Status':
        setModalTitle('Change Status');
        break;
      case 'Cancel':
        setModalTitle('Cancel');
        break;
      case 'Re-assign':
        setModalTitle('Re-assign');
        break;
      default:
        console.log(`Action for ${entry} triggered`);
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
              <th onClick={(e) => e.stopPropagation()}>
                <PageTableActions>
                  {dropdown.map((entry) => (
                    <PageTableAction
                      key={entry.title}
                      icon={entry.icon}
                      text={entry.title}
                      onClick={() => {
                        handleClick(entry.title, booking);
                      }}
                    />
                  ))}
                </PageTableActions>
              </th>
            </tr>
          );
        })}
        page={page}
        numberOfPages={numberOfPages}
        onPageChange={setPage}
        pageItemCount={bookings.length}
        totalItemCount={totalCount}
      />
      <Modal
        isVisible={isModalVisible}
        onClose={closeModal}
        children={<ModalContent modalTitle={modalTitle} status={status} statuses={statuses} />}
        title={modalTitle}
        isQuote={false}
      />
    </>
  );
}
