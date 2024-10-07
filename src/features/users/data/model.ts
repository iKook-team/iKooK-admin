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
}
