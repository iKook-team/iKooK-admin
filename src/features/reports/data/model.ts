import { User } from '../../users/data/model.ts';

export interface Report {
  id: string;
  chef?: User;
  reported_by?: User;
  menu?: {
    id: string;
    menu_name: string;
    menu_price: string;
    chef: User;
    images: string[];
    status: string;
    currency: string;
  };
  reason: string;
  created_at: string;
  is_active: boolean;
  responded: boolean;
}
