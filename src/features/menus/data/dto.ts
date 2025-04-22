import { Menu } from './model.ts';
import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';

export type GetAllMenusResponse = GenericResponse<PagedResponse<Menu>>;

export type GetTopMenus = GenericResponse<
  Array<{
    id: number;
    name: string;
    chef_name: string;
    num_bookings: number;
  }>
>;

export type GetMenuResponse = GenericResponse<Menu>;
