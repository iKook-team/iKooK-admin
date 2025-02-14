import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PageBackButton from '../../app/components/page/PageBackButton';
import PageTitle from '../../app/components/page/PageTitle';
import BudgetCard, { MenuList } from './components/BookingBudgetCard';
import { EnquiryProfileListTile, MenuProfileListTile } from './components/RoundedRowList';
import QuotesColumn from './components/QuotesColumn';
import { useFetchBookingQuery } from './domain/usecase';
import Modal from './components/BookingsModal';
import EditMenuModalContent from './components/EditMenuModalContent';
import { BookingType } from './domain/types.ts';

export default function BookingEditScreen() {
  const filters = useMemo(() => ['in-progress', 'rejected', 'successful'], []);

  const { id: bookingId } = useParams();
  const [params] = useSearchParams();
  const type = params.get('type') as BookingType;

  const { isPending, booking, error } = useFetchBookingQuery(bookingId!);

  const date = booking?.created_at
    ? new Date(booking!.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  const iconTextList = [
    { icon: 'calender-check', text: `${date}` },
    { icon: 'location-pin', text: `${booking?.location.addressString}` },
    {
      icon: 'person-male-female',
      text:
        `${booking?.no_of_guest}` +
        `${booking?.no_of_guest != undefined && booking.no_of_guest > 0 ? ' persons' : ' person'}`
    }
  ];

  const menuList = [
    { icon: 'carrot', text: 'All Ingredients' },
    { icon: 'car', text: "Chef's travel and insurance costs" },
    { icon: 'dish', text: 'Serving and Clean-up' },
    {
      icon: 'shield',
      text: 'Money Protection',
      extratext: 'We pay the chefs after the event, to protect your money'
    }
  ];

  const enquiryProfileList = [
    { icon: 'ci_location', text: `${booking?.chef?.country}`, review: null },
    {
      icon: 'star',
      text: `${booking?.chef?.rating}`,
      review: `(${booking?.chef?.reviews + ' ' + 'reviews'})`
    }
  ];

  const enquiryProfileList1 = [
    { icon: 'cuisine', text: `10 cuisine`, review: null },
    { icon: 'group', text: `${booking?.no_of_guest} + people`, review: null }
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [filter, setFilter] = useState<string>(filters[0]);

  const capitalizeFirst = (str: string | undefined) =>
    str!.charAt(0).toUpperCase() + str!.slice(1).toLowerCase();

  console.log(booking);

  return (
    <>
      <PageBackButton />

      {isPending || booking === undefined ? (
        <div></div>
      ) : error?.message ? (
        <div className="text-center text-red-500">{error.message}</div>
      ) : (
        <div className="flex flex-row justify-between my-6 mr-20">
          <PageTitle
            title={
              type === BookingType.menus
                ? `${capitalizeFirst(booking?.booking_type)} Booking`
                : `${capitalizeFirst(booking?.booking_type === 'custom-booking' ? booking.custom_booking_type_selected : booking?.booking_type)}`
            }
          />
          <button onClick={() => setIsModalVisible(true)}>
            <h2 className="underline">edit {type}</h2>
          </button>
        </div>
      )}
      {isPending || booking === undefined ? (
        <span className="loading loading-dots loading-lg"></span>
      ) : error?.message ? (
        <div className="text-center text-red-500">{error.message}</div>
      ) : (
        <div className="flex justify-between w-[90%]">
          {booking.chef ? (
            <div className="flex flex-col w-[75%]">
              {type != BookingType.menus ? (
                <EnquiryProfileListTile
                  booking={booking}
                  enquiryProfileList={enquiryProfileList}
                  enquiryProfileList1={enquiryProfileList1}
                />
              ) : (
                <MenuProfileListTile
                  booking={booking}
                  enquiryProfileList={enquiryProfileList}
                  enquiryProfileList1={[]}
                />
              )}
              {type != BookingType.menus ? (
                <BudgetCard
                  message={booking.message}
                  cuisines={booking.cuisines}
                  eventType={booking?.event_type}
                  allergies={
                    booking.xallergies.length === 0
                      ? ['None']
                      : booking.xallergies.length > 1
                        ? booking?.xallergies
                        : []
                  }
                  budget={booking.budget}
                />
              ) : (
                <MenuList
                  starterList={booking.menu.starter}
                  mainList={booking.menu.main}
                  dessertList={booking.menu.dessert}
                />
              )}
            </div>
          ) : (
            <div>No chef assigned</div>
          )}

          <QuotesColumn
            booking={booking}
            type={type}
            iconTextList={iconTextList}
            menuList={menuList}
            filter={filter}
            filters={filters}
            setFilter={setFilter}
          />
        </div>
      )}
      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        children={
          <EditMenuModalContent
            starterList={ booking?.menu.starter && booking!.menu.starter.map((e) => e.menuName) || []}
            mainList={booking?.menu.main && booking!.menu.main.map((e) => e.menuName) || []}
            dessertList={ booking?.menu.dessert && booking!.menu.dessert.map((e) => e.menuName) || []}
          />
        }
        title={'Edit menu'}
        isQuote={true}
      />
    </>
  );
}
