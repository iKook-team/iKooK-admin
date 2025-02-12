import { GenericResponse } from '../../../app/data/dto.ts';
import { CalendarDay } from './types.ts';

export type GetCalendarResponse = GenericResponse<CalendarDay[]>;
