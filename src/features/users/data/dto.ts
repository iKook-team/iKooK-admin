import { Role, User } from './model.ts';
import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';
import { UserType } from '../domain/types.ts';

export interface GetAllUsersRequest {
  type: UserType;
  verified?: boolean;
  query?: string;
  includeServices?: boolean;
}

export interface GetRoleRequest {
  isAdmin: boolean;
}

export type GetAllUsersResponse = GenericResponse<PagedResponse<User>>;
export type GetRoleResponse = GenericResponse<PagedResponse<Role>>;

export interface ProfileRequest {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  state: string;
  city: string;
  address: string;
  post_code: string;
  experience: string;
  cuisines: string;
  events: string;
  weekly_charges: number;
  monthly_charges: number;
}
