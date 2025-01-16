import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api';
import { GetAllUsersRequest, GetAllUsersResponse } from '../data/dto.ts';
import { useMemo, useState } from 'react';
import { UserType } from './types.ts';
import { GenericResponse } from '../../../app/data/dto.ts';
import { User } from '../data/model.ts';
import { toast } from 'react-toastify';

export function useFetchUsersQuery(request: GetAllUsersRequest) {
  const filters = useMemo(() => ['all', 'verified', 'unverified'], []);

  const [filter, setFilter] = useState<string>(filters[0]);
  const [query, setQuery] = useState<string>();
  const [page, setPage] = useState(1);

  const verified = filter === 'all' ? undefined : filter === 'verified';

  const { isPending, data, error } = useQuery({
    queryKey: [request.type, verified, page],
    queryFn: async ({ queryKey }) => {
      const [type, verified, page] = queryKey;
      const response = await fetch({
        url: `admin/get-all-users?user_type=${type}&page_number=${page}&page_size=20${verified !== undefined ? `&verified=${verified}` : ''}`,
        method: 'GET'
      });
      return response.data as GetAllUsersResponse;
    }
  });

  const users = useMemo(() => {
    const items = data?.data?.items || [];

    if (!query || !data) {
      return items;
    }

    return items.filter((user) => {
      const cleanedQuery = query!.toLowerCase();
      return (
        user.first_name.toLowerCase().includes(cleanedQuery) ||
        user.last_name.toLowerCase().includes(cleanedQuery)
      );
    });
  }, [query, data]);

  return {
    isPending,
    error,
    page,
    setPage,
    users,
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    totalCount: data?.data?.total_count || 0,
    numberOfPages: data?.data?.number_of_pages || 0
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

export function useToggleUserActive(type: UserType) {
  return useMutation({
    mutationFn: ({ id, disable }: { id: string; disable: boolean }) => {
      const route = disable ? 'disable-user' : 'activate-user';
      return fetch({
        url: `/admin/${route}/${id}`,
        method: 'PUT'
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [type] });
    }
  });
}

export function useToggleUserVerificationStatus(type: UserType) {
  return useMutation({
    mutationFn: ({
      id,
      accept,
      type,
      message
    }: {
      id: string;
      accept: boolean;
      type: string;
      message?: string;
    }) => {
      return fetch({
        url: `/admin/update-verification-status`,
        method: 'POST',
        data: {
          userId: id,
          status: accept ? 'accept' : 'reject',
          type,
          message
        }
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [type] });
    }
  });
}

export function useCreateNewUser(type: UserType) {

  const [loading, setLoading] = useState(false);


   const mutation = useMutation({
      mutationFn: async (request:  {
        first_name: string;
        last_name: string;
        username: string;
        email: string;
        mobile: string;
        role: UserType;
      }) => {
        const response = await fetch({
          url: `/UserManagement/create-user`,
          method: 'POST',
          data: request
        });
        return response.data ;
      }
    });


    return {
      createUser: async (request: {
        first_name: string;
        last_name: string;
        username: string;
        email: string;
        mobile: string;
        role: UserType;
      }) => {
        if (loading) {
          return;
        }
  
        try {
          setLoading(true);
  
          const response = await mutation.mutateAsync(request);
  
         
            toast(`${type} ${response.data.first_name} created successfully`, {
              type: 'success'
            });
        
        } catch (_) {
          // setButtonText('Login');
          // setUserId(undefined);
        } finally {
          setLoading(false);
        }
      },
      loading,
      // userId,
      // buttonText
    };

  // return useMutation({
  //   mutationFn: ({
  //     first_name,
  //     last_name,
  //     username,
  //     email,
  //     mobile,
  //     role
  //   }: {
  //     first_name: string;
  //     last_name: string;
  //     username: string;
  //     email: string;
  //     mobile: string;
  //     role: UserType;
  //   }) => {
  //     return fetch({
  //       url: `/UserManagement/create-user`,
  //       method: 'POST',
  //       data: {
  //         first_name: first_name,
  //         last_name: last_name,
  //         username: username,
  //         email: email,
  //         mobile: mobile,
  //         role: role
  //       }
  //     });
  //   },
   
  // });
}
