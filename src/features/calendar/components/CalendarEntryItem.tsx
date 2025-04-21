import { CalendarEntry } from '../domain/types.ts';

interface CalendarEntryItemProps {
  entry?: CalendarEntry;
  onClick?: () => void;
}

export default function CalendarEntryItem({ entry, onClick }: CalendarEntryItemProps) {
  const hasBookings = (entry?.bookings || []).length > 0;
  return (
    <div
      className={`w-full h-[10.4375rem] bg-green/10 rounded-md px-2 ${hasBookings ? 'pt-1.5' : 'pt-5'}`}
      onClick={entry ? onClick : undefined}
    >
      {entry && hasBookings ? (
        <>
          {/*<ImageStack*/}
          {/*  images={*/}
          {/*    entry.bookings*/}
          {/*      .map((booking) =>*/}
          {/*        Constants.getImageUrl(booking.chef.avatar, booking.chef.first_name)*/}
          {/*      )*/}
          {/*      .filter(Boolean) as string[]*/}
          {/*  }*/}
          {/*  includeRing={true}*/}
          {/*  maxImages={3}*/}
          {/*  moreClassName="bg-primary"*/}
          {/*/>*/}
          <p className="mt-0.5 capitalize line-clamp-1 text-darck-charcoal/70 text-[0.375rem]">
            {entry.bookings.map((booking) => booking.host).join(', ')}
          </p>
          <p className="mt-2.5 font-medium text-[0.625rem]">
            {entry.bookings.length} Booking{entry.bookings.length > 1 ? 's' : ''} Available
          </p>
        </>
      ) : entry ? (
        <p className="text-dark-charcoal/40 text-[0.625rem]">Unavailable</p>
      ) : (
        <p className="text-dark-charcoal/40 text-[0.625rem]">Available</p>
      )}
    </div>
  );
}
