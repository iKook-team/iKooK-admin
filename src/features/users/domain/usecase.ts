import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api';
import { GetAllUsersRequest, GetAllUsersResponse } from '../data/dto.ts';
import { useEffect, useMemo, useState } from 'react';
import { UserType } from './types.ts';
import { GenericResponse } from '../../../app/data/dto.ts';
import { User } from '../data/model.ts';
import axios from 'axios';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';

export function useFetchUsersQuery(request: GetAllUsersRequest) {
  const filters = useMemo(() => ['all', 'verified', 'unverified'], []);
  const services = useMemo(
    () => [
      'Chef at Home',
      'Cooking Class',
      'Meal Delivery',
      'Large Event',
      'Meal Prep',
      'Fine Dining',
      'Corporate Dining',
      'Box Grocery',
      'Eating Coach'
    ],
    []
  );

  const [filter, setFilter] = useState<string>(filters[0]);
  const [service, setService] = useState<string | undefined>(
    request.includeServices ? services[0] : undefined
  );
  const [query, setQuery] = useState<string>();
  const [page, setPage] = useState(1);

  const verified = filter === 'all' ? undefined : filter === 'verified';
  const debouncedQuery = useDebouncedValue(query, 500);

  useEffect(() => {
    // reset page when filter changes
    setPage(1);
  }, [filter, debouncedQuery]);

  const { isPending, data, error } = useQuery({
    queryKey: [request.type, service, verified, page, debouncedQuery],
    queryFn: async ({ queryKey }) => {
      const [type, service, verified, page, query] = queryKey;
      const baseUrl =
        request.type === UserType.admin ? 'users/admins?' : `users/profiles?user_type=${type}&`;
      const response = await fetch({
        url: `${baseUrl}page=${page}&page_size=20${verified !== undefined ? `&identity_verified=${verified}` : ''}${query ? `&search=${query}` : ''}${service ? `&chef_service=${service}` : ''}`,
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
    users: data?.data?.results ?? [],
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    service,
    setService,
    services,
    totalCount: data?.data?.count ?? 0,
    numberOfPages: data?.data?.total ?? 0
  };
}

export function useFetchUserQuery(type: UserType, id?: number | string) {
  const query = useQuery({
    queryKey: [type, id],
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey;
      const response = await fetch({
        url: `/users/profiles/${id}/`,
        method: 'GET'
      });
      return response.data as GenericResponse<User>;
    },
    enabled: !!id
  });

  return {
    ...query,
    data: query?.data?.data
  };
}

export function useUpdateUser(type: UserType) {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => {
      return fetch({
        url: `/users/profiles/${id}/`,
        method: 'PATCH',
        data
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [type] });
    }
  });
}

export function useCreateUser(type: UserType) {
  return useMutation({
    mutationFn: async (request: User) => {
      const response = await fetch({
        url: `users/auth/signup/`,
        method: 'POST',
        data: request
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [type] });
    }
  });
}

export function useCheckUserNameValidity(username: string) {
  const { isPending, data, error } = useQuery({
    queryKey: ['usernameValidity', username],
    queryFn: async ({ queryKey }) => {
      const [_, username] = queryKey;

      // const regex = ; // Matches any digit (0-9)

      if (!username || username.length <= 3) {
        throw new Error('Username should not be empty or less than 3 characters');
      }

      if (!/^[a-zA-Z\s]+$/.test(username)) {
        throw new Error('Username should not contain a number or symbol');
      }

      try {
        const response = await fetch({
          url: `registration/username/validity-check/${username}`,
          method: 'GET',
          showError: false
        });

        return response.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 409) {
            throw new Error('Username already in use');
          }
        }
        // Rethrow any other errors
        throw new Error('Unknown error');
      }
    },
    enabled: !!username, // Avoid querying if username is falsy
    retry: false
  });

  return {
    isPending,
    successMsg: data?.message,
    errorMsg: error?.message
  };
}

export function useDeleteAccount(type: UserType) {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return await fetch({
        url: `UserManagement/delete-account/${id}`,
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [type] });
    }
  });
}

export function useResetPassword(type: UserType) {
  const mutation = useMutation({
    mutationFn: async (request: { email: string }) => {
      const response = await fetch({
        url: `user-management/password-reset`,
        method: 'POST',
        data: request
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [type] });
    }
  });

  return {
    resetPassword: async (request: { email: string }) => {
      await mutation.mutateAsync(request);
    }
  };
}
