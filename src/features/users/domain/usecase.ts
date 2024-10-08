import { useQuery } from '@tanstack/react-query';
import fetch from '../../../app/services/api';
import { GetAllUsersRequest, GetAllUsersResponse } from '../data/dto.ts';
import { useMemo } from 'react';

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
