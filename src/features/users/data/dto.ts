import { User } from './model.ts';

export interface GetAllUsersRequest {
  user_type: string;
  verified?: boolean;
}

export interface GetAllUsersResponse extends GenericResponse<User[]> {}
