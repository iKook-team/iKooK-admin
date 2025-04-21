import { PagedResponse } from '../../../app/data/dto.ts';
import { CalendarEntry } from './types.ts';

export type GetCalendarResponse = PagedResponse<CalendarEntry>;
