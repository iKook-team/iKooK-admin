import { User } from '../../users/data/model.ts';

export interface Payment {
  id: string;
  user: User;
  email: string | null;
  created_at: string;
  gateway: string;
  charge_type: string;
  amount: number;
  currency: string;
  status: string;
  trxId: string;
  trxRef: string | null;
}
