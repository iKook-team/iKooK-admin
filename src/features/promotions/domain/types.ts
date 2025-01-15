export enum PromotionType {
  gifts = 'gifts',
  purchased = 'purchased',
  promo = 'promo code'
}

export interface GiftCard {
  id: string;
  card_number: string;
  amount: number;
  currency: string;
  created_at: string;
  purchased_by: {
    username: string;
    first_name: string;
    last_name: string;
    country: string;
    photo: string;
  } | null;
  is_active: boolean;
  redeemed: boolean;
}
