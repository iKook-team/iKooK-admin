import { Menu } from './model.ts';
import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';

export type GetAllMenusResponse = GenericResponse<PagedResponse<Menu>>;

export type GetTopMenus = GenericResponse<
  Array<{
    id: number;
    name: string;
    chef: {
      id: number;
      first_name: string;
      last_name: string;
    };
    currency: string;
    price_per_person: number;
  }>
>;

export type GetMenuResponse = GenericResponse<Menu>;
