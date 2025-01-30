import { useMemo } from 'react';
import { BookingType } from '../domain/types.ts';

interface BookingsHeaderProps {
  type: BookingType;
}

export default function BookingsHeader({ type }: BookingsHeaderProps) {
  const header = useMemo(
    () =>
      type === BookingType.enquiries
        ? ['Booking ID', 'User', 'Location', 'Proposals', 'Number Of Guests']
        : ['Booking ID', 'User', 'Chef', 'Menu', 'Amount', 'Booking Status'],
    [type]
  );

  return (
    <tr>
      {header.map((title) => (
        <th key={title} className="text-left">
          {title}
        </th>
      ))}
    </tr>
  );
}
