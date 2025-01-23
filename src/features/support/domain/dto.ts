import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';
import { SupportTicket } from './types.ts';

export type GetAllSupportTicketsResponse = GenericResponse<PagedResponse<SupportTicket>>;
