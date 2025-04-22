import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';
import { GiftCard } from './types.ts';

export type GetAllGiftCardsResponse = GenericResponse<PagedResponse<GiftCard>>;

export type CreateGiftCardRequest = {
  currency: string;
  amount: number;
};

export type SendGiftCardRequest = {
  gift_card: number;
  email: string;
  override: boolean;
};

export type CreatePromoCodeRequest = {
  title: string;
  description: string;
  discount_percentage?: number;
  code: string;
  // currency?: string;
  num_users: number;
  start?: string;
  end?: string;
  menu?: number;
};
