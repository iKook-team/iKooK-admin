export enum PromotionType {
  gifts = 'gifts',
  purchased = 'purchased',
  promo = 'promo code'
}

interface GiftCardUser {
  username: string;
  first_name: string;
  last_name: string;
  country: string;
  photo: string;
}

export interface GiftCard {
  id: number;
  card_number?: string;
  code?: string;
  amount: number;
  currency: string;
  created_at: string;
  duration_from?: string;
  duration_to?: string;
  purchased_by: GiftCardUser | null;
  created_by: GiftCardUser | null;
  discount_percentage?: number;
  is_active: boolean;
  redeemed: boolean;
  status: string;
}
