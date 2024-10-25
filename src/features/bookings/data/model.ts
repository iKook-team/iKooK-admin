
export interface BookingUser {
  firstName: string;
  lastName: string;
  photo: string;
}

export interface Proposal{
  amount : string;
  currency : string ;
  photo : string ;
  username : string; 
}


export interface Booking {
  amount: number;
  chef: BookingUser;
  currency: string;
  country: string;
  id: string;
  location: string;
  menu: string[];
  number_of_guest: number;
  proposals: Proposal[];
  status: string;
  trxid: string;
  user: BookingUser;
}


