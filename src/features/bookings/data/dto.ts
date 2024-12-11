import { Booking } from './model.ts';
import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';
import { BookingType } from '../domain/types.ts';

export interface GetAllBookingsRequest {
  query?: string;
  bookingType: BookingType;
}

export type GetAllBookingsResponse = GenericResponse<PagedResponse<Booking>>;
