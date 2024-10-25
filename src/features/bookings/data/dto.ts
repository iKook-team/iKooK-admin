import { Booking } from './model.ts';
import { GenericResponse } from '../../../app/data/dto.ts';

export interface GetAllBookingsRequest {
  query?: string;
  bookingType: string;
}

export interface GetAllBookingsResponse extends GenericResponse<Booking[]> {}
