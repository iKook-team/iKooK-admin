import { CurrentUser } from '../../auth/data/model.ts';
import { ServiceType, UserType } from '../domain/types.ts';

export interface User extends CurrentUser {
  username: string;
  user_type: UserType;
  is_active: boolean;
  email: string;
  address: string;
  bio: string;
  postal_code: string;
  city: string;
  country: string;
  balance?: number;
  average_rating?: number;
  num_reviews?: number;
  phone_number?: string;
  document_verified: boolean;
  culinary_certificate: string | null;
  identity_document: string | null;
  identity_verified: boolean;
  identity_type: string;
  identity_number: string;
  status: string;
  cuisines: string[];
  events: string[];
  email_notify: boolean;
  sms_notify: boolean;
}

export interface Role {
  id: string;
  name: string;
}

export interface ChefService {
  id: number;
  chef: User | number;
  availability: boolean;
  chef_service: ServiceType;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
  starting_price_per_person: number;
  min_num_of_guests: number;
  cuisines: string[];
  service: number;

  // Optional fields for specific service types
  meal_prep_appearance?: string;
  delivery_option?: string;
  events?: string[] | null;
  price_per_hour?: string | number;
  services?: string[];
  cooking_class_appearance?: string;
  delivery_time_in_hrs?: string | number;
}
