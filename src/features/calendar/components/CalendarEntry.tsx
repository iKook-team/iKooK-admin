import { CalendarBooking } from '../domain/types.ts';
import ImageStack from '../../../app/components/ImageStack.tsx';
import Constants from '../../../utils/constants.ts';

interface CalendarEntryProps {
  bookings: CalendarBooking[];
  onClick?: () => void;
}

export default function CalendarEntry({ bookings, onClick }: CalendarEntryProps) {
  return (
    <div
      className={`w-full h-[10.4375rem] bg-green/10 rounded-md px-2 ${bookings.length === 0 ? 'pt-1.5' : 'pt-5'}`}
      onClick={bookings.length > 0 ? onClick : undefined}
    >
      {bookings.length === 0 ? (
        <p className="text-dark-charcoal/40 text-[0.625rem]">Available</p>
      ) : (
        <>
          <ImageStack
            images={
              bookings
                .map((booking) =>
                  Constants.getImageUrl(booking.chef.photo, booking.chef.first_name)
                )
                .filter(Boolean) as string[]
            }
            includeRing={true}
            maxImages={3}
            moreClassName="bg-primary"
          />
          <p className="mt-0.5 capitalize line-clamp-1 text-darck-charcoal/70 text-[0.375rem]">
            {bookings.map((booking) => 'Chef ' + booking.chef.first_name).join(', ')}
          </p>
          <p className="mt-2.5 font-medium text-[0.625rem]">
            {bookings.length} Booking{bookings.length > 1 ? 's' : ''} Available
          </p>
        </>
      )}
    </div>
  );
}
