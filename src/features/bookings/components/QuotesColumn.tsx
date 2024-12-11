import React, { SetStateAction, useState } from 'react';
import { getImageUrl } from '../../../utils/getImageUrl';
import { Booking, Quote } from '../data/model';
import Constants from '../../../utils/constants';
import { DropdownField } from '../../../app/components/InputField';
import Modal from './BookingsModal';
import QuoteCardGrid from './QuotesGrid';
import { ViewQuoteModal } from './QuotesModal';
import { useAcceptQuote } from '../domain/usecase';
import { BookingType } from '../domain/types.ts';

interface IconTextItem {
  icon: string;
  text: string;
}

interface MenuItem {
  icon: string;
  text: string;
  extratext?: string;
}

interface BookingComponentProps {
  booking: Booking;
  type?: BookingType;
  iconTextList: IconTextItem[];
  menuList: MenuItem[];
  filter?: string;
  filters?: string[];
  setFilter?: (value: SetStateAction<string>) => void;
}

const QuotesColumn: React.FC<BookingComponentProps> = ({
  booking,
  type,
  iconTextList,
  menuList,
  filter,
  filters,
  setFilter
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isQuoteModalVisible, setIsQuoteModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const closeQuoteModal = () => setIsQuoteModalVisible(false);
  const openQuoteModal = () => setIsQuoteModalVisible(true);

  const enquiryProfileList = [
    { icon: 'ci_location', text: `${booking?.chef?.country}`, review: null },
    {
      icon: 'star',
      text: `${booking?.chef?.rating}`,
      review: `(${booking?.chef?.reviews + ' ' + 'reviews'})`
    }
  ];

  const [currentQuote, setCurrentQuote] = useState<Quote | undefined>(undefined);
  const { performAcceptQuote, loading: acceptingQuote } = useAcceptQuote();

  return (
    <div className="flex flex-col aspect-[370/600] rounded-xl shadow-xl border border-gray-300 bg-white px-10 justify-evenly items-center h-min gap-3 py-5 max-w-[500px] ">
      {type != BookingType.menus && (
        <button
          onClick={type ? openModal : () => performAcceptQuote(currentQuote?.image!)}
          className="btn btn-primary w-full h-min capitalize"
          disabled={acceptingQuote}
        >
          {acceptingQuote ? 'Accepting Quote...' : type ? 'Quotes' : 'Accept Quote'}
        </button>
      )}

      {type &&
        (booking.chef === null ? (
          <div>No chef found</div>
        ) : (
          <div className="flex flex-row gap-4 items-center w-full">
            <img
              src={`${Constants.userUrl}/${booking?.user?.photo}`}
              alt={booking.user?.first_name}
              className="w-8 h-8 aspect-square rounded-full"
            />
            <div className="flex flex-col">
              <span className="capitalize font-bold">
                {`${booking.user?.first_name} ${booking.user?.last_name}`}
              </span>
              <span>{booking.user?.email}</span>
            </div>
          </div>
        ))}

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
          <h1>{booking.no_of_guest || 0} Guests * £20</h1>
          <h1>£ {booking.no_of_guest * 20}</h1>
        </div>

        <div className="flex justify-between pb-5 border-b">
          <h1>Platform Fees 2.5%</h1>
          <h1>£ {booking.no_of_guest * 20 * 0.025}</h1>
        </div>

        <div className="flex justify-between">
          <h1 className="font-bold uppercase">Total</h1>
          <h1>£ {(booking.no_of_guest * 20 * 1.025).toFixed(2)}</h1>
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
            <button onClick={() => {}} className="btn btn-outline w-full h-min capitalize">
              Cancel
            </button>

            <button onClick={() => {}} className="btn bg-black text-white w-full h-min capitalize">
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
            quotesList={booking.quotes}
            viewQuote={openQuoteModal}
            setCurrentQuote={setCurrentQuote}
          />
        }
        title={'custom booking quotes'}
        isQuote={true}
      />

      <Modal
        isVisible={isQuoteModalVisible}
        onClose={closeQuoteModal}
        children={
          <ViewQuoteModal
            booking={booking}
            quote={currentQuote}
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
};

export default QuotesColumn;
