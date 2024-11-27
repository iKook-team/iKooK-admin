import { FC } from 'react';
import { BookingType } from '../domain/types.ts';

interface BookingEnquiryButtonsProps {
  activeButton: string;
  setBookingType: (button: BookingType) => void;
}

const BookingEnquiryButtons: FC<BookingEnquiryButtonsProps> = ({
  activeButton,
  setBookingType
}) => {
  return (
    <div className="flex flex-row gap-3 mt-3">
      {Object.values(BookingType).map((type) => (
        <button
          key={type}
          className={`capitalize p-3 rounded-3xl w-32 ${
            activeButton === type ? 'bg-primary text-white' : 'border border-gray-300'
          }`}
          onClick={() => setBookingType(type)}
          disabled={activeButton === type}
        >
          {type === BookingType.menus ? 'bookings' : type}
        </button>
      ))}
    </div>
  );
};

export default BookingEnquiryButtons;
