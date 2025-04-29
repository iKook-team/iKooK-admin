export interface AddonClient {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  city: string;
  address: string;
  business_name: string;
  postal_code: string;
  avatar: string;
  status: AddonClientStatus;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface AddonService {
  id: number;
  name: string;
  price: number; // Assuming price should be a number
  image: string;
  status: AddonServiceStatus;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  client: number; // Assuming this is a reference to a client ID
}

export enum AddonClientStatus {
  verified = 'Verified',
  unverified = 'Unverified'
}

export enum AddonServiceStatus {
  active = 'Active',
  suspended = 'Suspended'
}
