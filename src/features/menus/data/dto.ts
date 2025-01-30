import { Menu, MenuDetails } from './model.ts';
import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';

export type GetAllMenusResponse = GenericResponse<PagedResponse<Menu>>;

export type GetTopMenus = GenericResponse<
  Array<{
    id: string;
    menu_name: string;
    chef: {
      id: string;
      first_name: string;
      last_name: string;
    };
    currency: string;
    total_amount: number;
    booking_count: number;
  }>
>;

export type GetMenuResponse = GenericResponse<MenuDetails>;
