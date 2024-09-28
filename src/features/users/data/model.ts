import { CurrentUser } from '../../auth/data/model.ts';

export interface User extends CurrentUser {
  username: string;
  is_active: boolean;
  menus: string[];
  photo: string;
  verified: boolean;
}
