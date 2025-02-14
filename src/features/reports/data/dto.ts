import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';
import { Report } from './model.ts';

export type GetAllReportsResponse = GenericResponse<PagedResponse<Report>>;
