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
import { useFetchUserQuery } from '../users/domain/usecase.ts';
import { UserType } from '../users/domain/types.ts';
import { useFetchMenuQuery } from '../menus/domain/usecase.ts';

export default function BookingEditScreen() {
  const filters = useMemo(() => ['in-progress', 'rejected', 'successful'], []);

  const { id } = useParams();

  const [params] = useSearchParams();
  const type = params.get('type') as BookingType;

  const { isPending, data: booking, error } = useFetchBookingQuery(type, id);
  const { data: chef } = useFetchUserQuery(UserType.chef, booking?.chef_id);
  const { data: menu } = useFetchMenuQuery(booking?.menu);

  const date = booking?.created_at
    ? new Date(booking!.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  const guests = booking?.num_of_persons ?? booking?.num_of_guests;

  const iconTextList = [
    { icon: 'calender-check', text: `${date}` },
    { icon: 'location-pin', text: `${booking?.address}` },
    {
      icon: 'person-male-female',
      text: `${guests}` + `${guests != undefined && guests > 0 ? ' persons' : ' person'}`
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
    {
      icon: 'ci_location',
      text: `${booking?.city ?? booking?.country ?? chef?.city ?? chef?.country}`,
      review: null
    },
    {
      icon: 'star',
      text: `${chef?.average_rating?.toFixed(2)}`,
      review: `(${chef?.num_reviews + ' ' + 'reviews'})`
    }
  ];

  const enquiryProfileList1 = [
    { icon: 'cuisine', text: `10 cuisine`, review: null },
    { icon: 'group', text: `${guests} + people`, review: null }
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [filter, setFilter] = useState<string>(filters[0]);

  return (
    <>
      <PageBackButton />

      {isPending || booking === undefined ? (
        <></>
      ) : error?.message ? (
        <div className="text-center text-red-500">{error.message}</div>
      ) : (
        <div className="flex flex-row justify-between my-6 mr-20">
          <PageTitle className="capitalize" title={`${booking?.chef_service} Booking`} />
          <button onClick={() => setIsModalVisible(true)} className="underline">
            Edit {type}
          </button>
        </div>
      )}
      {isPending || booking === undefined ? (
        <span className="loading loading-dots loading-lg"></span>
      ) : error?.message ? (
        <div className="text-center text-red-500">{error.message}</div>
      ) : (
        <div className="flex justify-between w-[90%]">
          {chef ? (
            <div className="flex flex-col w-[75%]">
              {type != BookingType.menus ? (
                <EnquiryProfileListTile
                  chef={chef}
                  enquiryProfileList={enquiryProfileList}
                  enquiryProfileList1={enquiryProfileList1}
                />
              ) : (
                <MenuProfileListTile
                  chef={chef}
                  menu={menu}
                  enquiryProfileList={enquiryProfileList}
                  enquiryProfileList1={[]}
                />
              )}
              {type != BookingType.menus ? (
                <BudgetCard
                  message={booking.message}
                  cuisines={menu?.cuisine_types ?? []}
                  eventType={booking?.event_type}
                  allergies={
                    booking.dietary_restrictions.length === 0
                      ? ['None']
                      : booking.dietary_restrictions_details.length > 1
                        ? booking?.dietary_restrictions
                        : []
                  }
                  budget={booking.budget}
                />
              ) : menu ? (
                <MenuList menu={menu} booking={booking} />
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div>No chef assigned</div>
          )}

          <QuotesColumn
            booking={booking}
            chef={chef}
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
            starterList={
              (booking?.menu.starter && booking!.menu.starter.map((e) => e.menuName)) || []
            }
            mainList={(booking?.menu.main && booking!.menu.main.map((e) => e.menuName)) || []}
            dessertList={
              (booking?.menu.dessert && booking!.menu.dessert.map((e) => e.menuName)) || []
            }
          />
        }
        title={'Edit menu'}
        isQuote={true}
      />
    </>
  );
}
