import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api';
import { GetAllAdminsResponse, GetAllUsersRequest, GetAllUsersResponse } from '../data/dto.ts';
import { useEffect, useMemo, useState } from 'react';
import { ServiceType, UserType } from './types.ts';
import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';
import { ChefService, User } from '../data/model.ts';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';

export function useFetchUsersQuery(request: GetAllUsersRequest) {
  const filters = useMemo(() => ['all', 'verified', 'unverified'], []);
  const services = useMemo(() => Object.values(ServiceType), []);

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
      return response.data as GetAllUsersResponse & GetAllAdminsResponse;
    }
  });

  return {
    isPending,
    error,
    page,
    setPage,
    users: data?.data?.results || data?.results || [],
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

export function useFetchChefServicesQuery(id?: number | string) {
  const query = useQuery({
    queryKey: [UserType.chef, id, 'services'],
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey;
      const response = await fetch({
        url: `/services?chef_id=${id}`,
        method: 'GET'
      });
      return response.data as PagedResponse<ChefService>;
    },
    enabled: !!id
  });

  return {
    ...query,
    data: query?.data?.results || []
  };
}

export function useUpdateUser(type: UserType) {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> | FormData }) => {
      return fetch({
        url: `/users/profiles/${id}/`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
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
    mutationFn: async (request: FormData) => {
      const response = await fetch({
        url:
          type === UserType.admin
            ? 'users/admins/'
            : type === UserType.chef
              ? 'users/admins/create-chef/'
              : 'users/admins/create-host/',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: request
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [type] });
    }
  });
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
