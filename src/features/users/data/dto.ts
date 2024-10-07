import { User } from './model.ts';
import { GenericResponse } from '../../../app/data/dto.ts';
import { UserType } from '../domain/types.ts';

export interface GetAllUsersRequest {
  type: UserType;
  verified?: boolean;
  query?: string;
}

export interface GetAllUsersResponse extends GenericResponse<User[]> {}
