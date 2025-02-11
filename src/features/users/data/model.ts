import { CurrentUser } from '../../auth/data/model.ts';

export interface User extends CurrentUser {
  username: string;
  is_active: boolean;
  email: string;
  address: string;
  country: string;
  rating?: number;
  mobile?: string;
  menus: string[];
  photo: string;
  verified: boolean;
  status: string;
  cuisines: string[];
  events: string[];
  verification?: {
    document?: {
      document_type: string;
      documents: string[];
      certificate?: string;
      identity?: string;
      message?: string;
      is_documents_verified: boolean;
      verifiedAt: string;
      status: string;
    };
    identity?: {
      identity_type?: string;
      identity_number?: string;
      status: string;
      message?: string;
      data?: {
        first_name: string;
        last_name: string;
        middle_name: string;
        gender: string;
        photo: string;
        date_of_birth: string;
        email?: string;
        phone_number: string;
        employment_status: string;
        marital_status?: string;
        customer: string;
      };
    };
  };
}

export interface Role{
  id : string;
  name : string;
}