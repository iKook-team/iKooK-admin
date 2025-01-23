import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api';
import { GetAllUsersRequest, GetAllUsersResponse, GetRoleRequest, GetRoleResponse } from '../data/dto.ts';
import { useMemo, useState } from 'react';
import { UserType } from './types.ts';
import { GenericResponse } from '../../../app/data/dto.ts';
import { User } from '../data/model.ts';
import { toast } from 'react-toastify';
import axios from 'axios';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';

export function useFetchUsersQuery(request: GetAllUsersRequest) {
  const filters = useMemo(() => ['all', 'verified', 'unverified'], []);

  const [filter, setFilter] = useState<string>(filters[0]);
  const [query, setQuery] = useState<string>();
  const [page, setPage] = useState(1);

  const verified = filter === 'all' ? undefined : filter === 'verified';
  const debouncedQuery = useDebouncedValue(query, 500);

  const { isPending, data, error } = useQuery({
    queryKey: [request.type, verified, page, debouncedQuery],
    queryFn: async ({ queryKey }) => {
      const [type, verified, page, query] = queryKey;
      const response = await fetch({
        url: `admin/get-all-users?user_type=${type}&page_number=${page}&page_size=20${verified !== undefined ? `&verified=${verified}` : ''}${query ? `&search_name=${query}` : ''}`,
        method: 'GET'
      });
      return response.data as GetAllUsersResponse;
    }
  });

  return {
    isPending,
    error,
    page,
    setPage,
    users: data?.data?.items ?? [],
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
    mutationFn: async (request: {
      first_name: string;
      last_name: string;
      username: string;
      email: string;
      mobile: string;
      role: string;
    }) => {
      const response = await fetch({
        url: `UserManagement/create-user`,
        method: 'POST',
        data: request
      });
      return response.data;
    }
  });

  return {
    createUser: async (request: {
      first_name: string;
      last_name: string;
      username: string;
      email: string;
      mobile: string;
      role: string;
    }) => {
      if (loading) {
        return;
      }

      try {
        setLoading(true);

         await mutation.mutateAsync(request);

        toast(`${type} created successfully`, {
          type: 'success'
        });
      } catch (error) {
        console.log(error);
        toast(` ${type} Account creation Unsuccefful`, {
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    },
    loading
  };
}

export function useCheckUserNameValidity(username  : string) {
  const [successmsg, setSuccess] = useState('');
  const [err, setErrorMsg] = useState('');
  const [status, setStatus] = useState(false);

  const { isPending } = useQuery({
    queryKey: ['usernameValidity', username ],
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, username] = queryKey;

      if (username === '') {
        return;
      }

      if (username.length <= 3){
        setErrorMsg("Username should not be less than 3");
        setSuccess('');
        return;
      }

      try {
        const response = await fetch({
          url: `registration/username/validity-check/${username}`,
          method: 'GET',
          showError : false
        });

        setSuccess(response.data.message);
        setErrorMsg('');
        setStatus(true);
        return response.data;
      } 
      catch (err) {
        if (axios.isAxiosError(err)) {
          // Handle AxiosError specifically
          if (err.response?.status === 409) {
            setErrorMsg('Username already in use');
            setSuccess('');
            setStatus(false);
          } else {
            return;
          }
        } 
        else {
          return;
        }
      }
    }
  });

  return {
    isPending,
    err,
    successmsg,
    status
  };
}

export function useGetRole(request: GetRoleRequest) {
  const { isPending, data, error } = useQuery({
    queryKey: [request.isAdmin],
    queryFn: async ({ queryKey }) => {
      const [isAdmin] = queryKey;
      const response = await fetch({
        // url: '/roleClaims/get-roles?admin=true',
        url: '/roleClaims/get-roles',
        method: 'GET'
      });
      return response.data as GetRoleResponse;
    }
  });

  const roles = useMemo(() => {
    const items = data?.data?.items || [];

    if (!data) {
      return items;
    }

    return items;
  }, [data]);

  return {
    isPending,
    error,
    roles,
    // totalCount: data?.data?.total_count || 0,
    // numberOfPages: data?.data?.number_of_pages || 0
  };
}
