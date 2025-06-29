import { User } from '../../users/data/model.ts';

export interface Payment {
  id: number;
  host: User;
  gateway: string;
  amount: string;
  status: string;
  created_at: string;
}
