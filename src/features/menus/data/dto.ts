import { User } from './model.ts';

export interface GetAllMenusRequest {
  menu_status?: string;
  page_number: number;
}

export interface GetAllMenusResponse extends GenericResponse<User[]> {}
