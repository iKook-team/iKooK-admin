import { User } from './model.ts';
import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';
import { UserType } from '../domain/types.ts';

export interface GetAllUsersRequest {
  type: UserType;
  verified?: boolean;
  query?: string;
}

export type GetAllUsersResponse = GenericResponse<PagedResponse<User>>;
