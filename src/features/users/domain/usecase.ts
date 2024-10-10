import { useQuery } from '@tanstack/react-query';
import fetch from '../../../app/services/api';
import { GetAllUsersRequest, GetAllUsersResponse } from '../data/dto.ts';
import { useMemo } from 'react';
import { UserType } from './types.ts';
import { GenericResponse } from '../../../app/data/dto.ts';
import { User } from '../data/model.ts';

export function useFetchUsersQuery(request: GetAllUsersRequest) {
  const { isPending, data, error } = useQuery({
    queryKey: [request.type, request.verified],
    queryFn: async ({ queryKey }) => {
      const [type, verified] = queryKey;
      const response = await fetch({
        url: `admin/get-all-users?user_type=${type}${verified !== undefined ? `&verified=${verified}` : ''}`,
        method: 'GET'
      });
      return response.data as GetAllUsersResponse;
    }
  });

  const users = useMemo(() => {
    if (!request.query || !data) {
      return data?.data || [];
    }

    return data?.data?.filter((user) => {
      const cleanedQuery = request.query!.toLowerCase();
      return (
        user.first_name.toLowerCase().includes(cleanedQuery) ||
        user.last_name.toLowerCase().includes(cleanedQuery)
      );
    });
  }, [request.query, data]);

  return {
    isPending,
    users,
    error
  };
}

export function useFetchUserQuery(type: UserType, id: string) {
  const { isPending, data, error } = useQuery({
    queryKey: [type, id],
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, id] = queryKey;
      const response = await fetch({
        url: `admin/get-user-details/${id}`,
        method: 'GET'
      });
      return response.data as GenericResponse<User>;
    }
  });

  return {
    isPending,
    user: data?.data,
    error
  };
}
