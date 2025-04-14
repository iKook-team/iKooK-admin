import { CurrentUser } from '../../auth/data/model.ts';
import { UserType } from '../domain/types.ts';

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
  culinary_certificate: string;
  identity_document: string;
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
