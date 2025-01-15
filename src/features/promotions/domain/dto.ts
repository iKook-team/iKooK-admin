import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';
import { GiftCard } from './types.ts';

export type GetAllGiftCardsResponse = GenericResponse<PagedResponse<GiftCard>>;
