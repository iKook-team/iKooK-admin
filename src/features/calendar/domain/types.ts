import { User } from '../../users/data/model.ts';

export interface CalendarDay {
  date: number;
  count: number;
  day: string;
  bookings: CalendarBooking[];
}

export interface CalendarBooking {
  id: string;
  user: User;
  chef: User;
  booking_type: string;
  date: string;
}
