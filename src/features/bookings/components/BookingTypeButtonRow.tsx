interface BookingEnquiryButtonsProps {
    activeButton: string;
    setBookingType: (button: string) => void;
  }
  
  const BookingEnquiryButtons: React.FC<BookingEnquiryButtonsProps> = ({
    activeButton,
    setBookingType,
  }) => {
    return (
      <div className="flex flex-row gap-3 mt-3">
        {/* Bookings Button */}
        <button
          className={`p-3 rounded-3xl w-32 ${
            activeButton === 'menu' ? 'bg-primary text-white' : 'border border-gray-300'
          }`}
          onClick={() => setBookingType('menu')}
          disabled={activeButton === 'menu'}
        >
          Bookings
        </button>
  
        {/* Enquiries Button */}
        <button
          className={`p-3 rounded-3xl w-32 ${
            activeButton === 'enquiries' ? 'bg-primary text-white' : 'border border-gray-300'
          }`}
          onClick={() => setBookingType('enquiries')}
          disabled={activeButton === 'enquiries'}
        >
          Enquiries
        </button>
      </div>
    );
  };
  
  export default BookingEnquiryButtons;
  