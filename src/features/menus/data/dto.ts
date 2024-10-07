import { Menu } from './model.ts';
import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';

export interface GetAllMenusResponse extends GenericResponse<PagedResponse<Menu>> {}
