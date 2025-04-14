export interface Location {
  addressString: string;
  type: string;
  coordinate: string[];
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
  id: number;
  chef_service: string;
  service: number;
  is_custom: boolean;
  status: BookingStatus;
  location: string;
  host_name: string;
  host_id: number;
  host_avatar: string;
  chef_name: string;
  chef_id: number;
  chef_avatar: string;
  total_cost: number;
  created_at: Date;
  updated_at: Date;
  address: string;
  additional_address_info: string;
  city: string;
  country: string;
  dietary_restrictions: string[];
  dietary_restrictions_details: string;
  event_date: string;
  event_time: string;
  event_venue: string;
  num_of_guests: number;
  num_of_persons: number;
  hob_type: string;
  hob_size: string;
  has_oven: boolean;
  menu: number;
  booking: number;
  menu_choices: number[];
  budget: number;
  event_type: string;
}

export enum BookingStatus {
  enquiries = 'Enquiries',
  pending = 'Pending',
  upcoming = 'Upcoming',
  completed = 'Completed',
  cancelled = 'Cancelled'
}
