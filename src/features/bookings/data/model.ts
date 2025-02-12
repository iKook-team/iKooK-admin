import { User } from '../../users/data/model.ts';

export interface BookingsUser {
  firstName: string;
  lastName: string;
  photo: string;
}

export interface EditBookingChef extends User {
  reviews: number;
}

export interface Proposal {
  amount: string;
  currency: string;
  photo: string;
  username: string;
}

export interface Location {
  addressString: string;
  type: string;
  coordinate: string[];
}

export interface Menu {
  menuName: string;
  description: string;
}

export interface QuoteMenu {
  menu_name: string;
  menu_description: string;
  price: number;
}

export interface QuoteChef {
  city: string;
  first_name: string;
  id: string;
  last_name: string;
  profile_picture: string;
  rating: number;
  review: number;
  username: string;
}

export interface Quote {
  id: string;
  amount: number;
  currency: string;
  image: string;
  dessert: QuoteMenu[];
  main: QuoteMenu[];
  menuName: string;
  side: QuoteMenu[];
  starter: QuoteMenu[];
  chef: QuoteChef;
}

export interface Bookings {
  amount: number;
  chef: BookingsUser;
  currency: string;
  country: string;
  id: string;
  menu: string[];
  number_of_guest: number;
  proposals: Proposal[];
  status: string;
  trxid: string;
  user: BookingsUser;
}

export interface BookingUser {
  country: string;
  email: string;
  first_name: string;
  last_name: string;
  id: string;
  photo: string;
  username: string;
  verified: boolean;
}

export interface Booking {
  chef: EditBookingChef;
  location: Location;
  no_of_guest: number;
  created_at: string;
  budget: number;
  message: string;
  event_type: string;
  xallergies: string[];
  cuisines: string[];
  menu: {
    starter: Menu[];
    main: Menu[];
    dessert: Menu[];
  };
  user: BookingUser;
  quotes: Quote[];
  booking_type: string;
  custom_booking_type_selected: string;
  currency: string;
}
