import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api';
import {
  GetAllUsersRequest,
  GetAllUsersResponse,
  GetRoleRequest,
  GetRoleResponse,
  ProfileRequest
} from '../data/dto.ts';
import { useMemo, useState } from 'react';
import { UserType } from './types.ts';
import { GenericResponse } from '../../../app/data/dto.ts';
import { User } from '../data/model.ts';
import axios from 'axios';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';

export function useFetchUsersQuery(request: GetAllUsersRequest) {
  const filters = useMemo(() => ['all', 'verified', 'unverified'], []);
  const services = useMemo(
    () => [
      'chef-at-home',
      'cooking-class',
      'gourmet-delivery',
      'large-event',
      'meal-prep',
      'fine-dining',
      'corporate-dining'
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

  const { isPending, data, error } = useQuery({
    queryKey: [request.type, service, verified, page, debouncedQuery],
    queryFn: async ({ queryKey }) => {
      const [type, service, verified, page, query] = queryKey;
      const response = await fetch({
        url: `admin/get-all-users?user_type=${type}&page_number=${page}&page_size=20${verified !== undefined ? `&verified=${verified}` : ''}${query ? `&search_name=${query}` : ''}${service ? `&service=${service}` : ''}`,
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
    service,
    setService,
    services,
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
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [type] });
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
      await mutation.mutateAsync(request);
    }
  };
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

export function useGetRole(request: GetRoleRequest) {
  const { isPending, data, error } = useQuery({
    queryKey: [request.isAdmin],
    queryFn: async ({ queryKey }) => {
      // const [isAdmin] = queryKey;
      const [] = queryKey; //This endpoint is a bit faulty, I will fix this after the endpoint is okay
      const response = await fetch({
        // url: `/roleClaims/get-roles?admin={isAdmin}`,
        url: `/roleClaims/get-roles`,
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
    roles
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

export function useEditProfile(type: UserType) {
  const mutation = useMutation({
    mutationFn: async (request: ProfileRequest) => {
      const response = await fetch({
        url: `/chef/edit-profile`,
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
    editProfile: async (request: ProfileRequest) => {
      await mutation.mutateAsync(request);
    }
  };
}

export function useToggleNotificationSettings(request: { id: string; type: UserType }) {
  return useMutation({
    mutationFn: async ({ type }: { type: 'sms' | 'email' }) => {
      const response = await fetch({
        url: `/UserManagement/toggle-notifications-settings?user_id=${request.id}&type=${type}`,
        method: 'GET'
      });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [request.type, request.id] });
    }
  });
}

export function useEditServiceDetails(type: UserType, service_type: string) {
  const mutation = useMutation({
    mutationFn: async (request: ProfileRequest) => {
      const response = await fetch({
        url: `/chef/update-service-detail/${service_type}`,
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
    editProfile: async (request: ProfileRequest) => {
      await mutation.mutateAsync(request);
    }
  };
}
