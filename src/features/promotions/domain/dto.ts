import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';
import { GiftCard } from './types.ts';

export type GetAllGiftCardsResponse = GenericResponse<PagedResponse<GiftCard>>;

export type CreateGiftCardRequest = {
  currency: string;
  amount: number;
};

export type CreatePromoCodeRequest = {
  title: string;
  description: string;
  percentage?: number;
  coupon_code: string;
  currency?: string;
  no_of_users: number;
  from_duration?: string;
  to_duration?: string;
  menu?: string;
};
