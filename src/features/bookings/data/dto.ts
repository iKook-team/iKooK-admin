import { Bookings } from './model.ts';
import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';


export interface GetAllBookingsResponse extends GenericResponse<PagedResponse<Bookings>> {}
