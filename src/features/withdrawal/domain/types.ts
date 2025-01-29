export interface Withdrawal {
  id: string;
  chef: {
    id: string;
    first_name: string;
    last_name: string;
    photo: string;
  } | null;
  status: string;
  created_at: string;
  amount: string;
  currency: string;
}
