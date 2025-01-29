import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';
import { Withdrawal } from './types.ts';

export type GetAllWithdrawalsResponse = GenericResponse<PagedResponse<Withdrawal>>;

export type CreateWithdrawalRequest = {
  chefId: string;
  amount: number;
};
