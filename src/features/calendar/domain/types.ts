export interface CalendarEntry {
  id: number;
  chef: number;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  bookings: CalendarBooking[];
}

export interface CalendarBooking {
  id: number;
  service: string;
  status: string;
  host: string;
}
