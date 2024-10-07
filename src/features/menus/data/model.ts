import { User } from '../../users/data/model.ts';

export interface Menu {
  id: string;
  chefID: User;
  menuName: string;
  menuPrice: string;
  currency: string;
  images: string[];
  verifiedAt: string;
  active: boolean;
  status: string;
}
