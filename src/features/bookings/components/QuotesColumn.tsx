import { SetStateAction, useState } from 'react';
import { getImageUrl } from '../../../utils/getImageUrl';
import { Booking, BookingStatus, Quote } from '../data/model';
import Constants from '../../../utils/constants';
import { DropdownField } from '../../../app/components/InputField';
import Modal from './BookingsModal';
import QuoteCardGrid from './QuotesGrid';
import { ViewQuoteModal } from './QuotesModal';
import { useAcceptQuote, useDeleteBooking, useUpdateBooking } from '../domain/usecase';
import { BookingType } from '../domain/types.ts';
import { User } from '../../users/data/model.ts';
import { formatCurrency } from '../../../utils/helper.ts';

interface IconTextItem {
  icon: string;
  text: string;
}

interface MenuItem {
  icon: string;
  text: string;
  extratext?: string;
}

interface QuotesColumnProps {
  chef: User;
  booking: Booking;
  type?: BookingType;
  iconTextList: IconTextItem[];
  menuList: MenuItem[];
  filter?: string;
  filters?: string[];
  setFilter?: (value: SetStateAction<string>) => void;
}

export default function QuotesColumn({
  booking,
  chef,
  type,
  iconTextList,
  menuList,
  filter,
  filters,
  setFilter
}: QuotesColumnProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isQuoteModalVisible, setIsQuoteModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const closeQuoteModal = () => setIsQuoteModalVisible(false);
  const openQuoteModal = () => setIsQuoteModalVisible(true);

  const mutation = useUpdateBooking();
  const deleteMutation = useDeleteBooking();

  const enquiryProfileList = [
    { icon: 'ci_location', text: `${chef?.country}`, review: null },
    {
      icon: 'star',
      text: `${chef?.average_rating?.toFixed(2)}`,
      review: `(${chef?.num_reviews + ' ' + 'reviews'})`
    }
  ];

  // const [currentQuote, setCurrentQuote] = useState<Quote | undefined>(undefined);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  const { performAcceptQuote, loading: acceptingQuote } = useAcceptQuote();
  console.log(currentQuote);

  const handleAcceptQuote = () => {
    if (currentQuote) {
      performAcceptQuote(currentQuote.id);
    } else {
      console.error('No quote selected!');
    }
  };

  const fee = 0.025;
  const guests = booking.num_of_persons || booking.num_of_guests;
  const originalTotal = booking.total_cost / (1 + fee);
  const guestPrice = originalTotal / (guests || 1);

  return (
    <div className="flex flex-col aspect-[370/600] rounded-xl shadow-xl border border-gray-300 bg-white px-10 justify-evenly items-center h-min gap-3 py-5 max-w-[500px] ">
      {type != BookingType.menus && (
        <button
          // onClick={type ? openModal : () => performAcceptQuote(currentQuote!.id)}
          onClick={type ? openModal : handleAcceptQuote}
          className="btn btn-primary w-full h-min capitalize"
          disabled={acceptingQuote}
        >
          {acceptingQuote ? 'Accepting Quote...' : type ? 'Quotes' : 'Accept Quote'}
        </button>
      )}

      <div className="flex flex-row gap-4 items-center w-full">
        <img
          src={Constants.getImageUrl(booking.host_avatar, booking.host_name)}
          alt={booking.host_name}
          className="w-8 h-8 aspect-square rounded-full"
        />
        <div className="flex flex-col">
          <span className="capitalize font-bold">{booking.host_name}</span>
          {/*<span>{booking.user?.email}</span>*/}
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full ">
        {iconTextList.map((each, index) => (
          <div key={index} className="flex gap-3 items-center  ">
            <img
              className="h-[16px]  w-[12px]"
              src={getImageUrl(`icons/${each.icon}.svg`)}
              alt=""
            />
            <h2 className="">{each.text}</h2>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between">
          <h1>
            {guests} Guests * {formatCurrency(guestPrice)}
          </h1>
          <h1>{formatCurrency(originalTotal)}</h1>
        </div>

        <div className="flex justify-between pb-5 border-b">
          <h1>Platform Fees 2.5%</h1>
          <h1>{formatCurrency(originalTotal * fee)}</h1>
        </div>

        <div className="flex justify-between">
          <h1 className="font-bold uppercase">Total</h1>
          <h1>{formatCurrency(booking.total_cost)}</h1>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {type === BookingType.menus && (
          <DropdownField
            value={filter}
            onChange={(e) => setFilter!(e.target.value)}
            options={filters!}
          />
        )}

        {type && (
          <>
            <button
              disabled={mutation.isPending}
              onClick={() =>
                mutation.mutate({ id: booking.id, data: { status: BookingStatus.cancelled } })
              }
              className="btn btn-outline w-full h-min capitalize"
            >
              Cancel
            </button>

            <button
              onClick={() => deleteMutation.mutate({ id: booking.id })}
              disabled={deleteMutation.isPending}
              className="btn bg-black-base text-white w-full h-min capitalize"
            >
              Delete
            </button>
          </>
        )}

        {!type && (
          <button className="border rounded-md border-slate-400 px-3 py-2 my-2 ">
            Message Chef
          </button>
        )}

        <div className="bg-yellow-50 p-3">
          <h1 className="capitalize font-bold">The Menu Includes</h1>
          {menuList.map((menu, index) => (
            <div className="flex gap-3 p-2 items-center" key={index}>
              <div className="bg-primary h-5 rounded-xl w-5 flex items-center justify-center">
                <img className="w-3 h-3" src={getImageUrl(`icons/${menu.icon}.svg`)} alt="" />
              </div>
              <div className="flex flex-col">
                <h1>{menu.text}</h1>
                {menu.extratext && <h1 className="text-xs">{menu.extratext}</h1>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isVisible={isModalVisible}
        onClose={closeModal}
        children={
          <QuoteCardGrid
            booking={booking.id}
            viewQuote={openQuoteModal}
            setCurrentQuote={setCurrentQuote}
          />
        }
        title={`${booking.is_custom ? 'custom booking' : booking.chef_service} quotes`}
        isQuote={true}
      />

      <Modal
        isVisible={isQuoteModalVisible}
        onClose={closeQuoteModal}
        children={
          <ViewQuoteModal
            booking={booking}
            quote={currentQuote!}
            enquiryProfileList={enquiryProfileList}
            enquiryProfileList1={[]}
            iconTextList={iconTextList}
            menuList={menuList}
          />
        }
        title={"Chef Bello's quotes"}
        isQuote={true}
      />
    </div>
  );
}
