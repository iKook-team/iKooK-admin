import { Menu, MenuDetails } from './model.ts';
import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';

export type GetAllMenusResponse = GenericResponse<PagedResponse<Menu>>;

export type GetMenuResponse = GenericResponse<MenuDetails>;
