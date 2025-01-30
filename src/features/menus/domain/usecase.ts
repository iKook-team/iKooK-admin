import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api';
import { useMemo, useState } from 'react';
import { GetAllMenusResponse, GetMenuResponse, GetTopMenus } from '../data/dto.ts';
import { UpdateMenuStatusRequest } from './types.ts';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';

export function useFetchMenusQuery() {
  const filters = useMemo(() => ['all', 'approved', 'unapproved'], []);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string>();
  const [filter, setFilter] = useState<string>(filters[0]);

  const debouncedQuery = useDebouncedValue(query, 500);

  const { isPending, data, error } = useQuery({
    queryKey: ['menu', page, filter, debouncedQuery],
    queryFn: async ({ queryKey }) => {
      const [_, page, filter, query] = queryKey;
      const response = await fetch({
        url: `admin/get-menus?page_number=${page}${filter === 'all' ? '' : `&menu_status=${filter}`}&page_size=20${query ? `&search_name=${query}` : ''}`,
        method: 'GET'
      });
      return response.data as GetAllMenusResponse;
    }
  });

  return {
    isPending,
    error,
    page,
    setPage,
    menus: data?.data?.items ?? [],
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    totalCount: data?.data?.total_count || 0,
    numberOfPages: data?.data?.number_of_pages || 0
  };
}

export function useFetchTopMenusQuery(currency: string) {
  return useQuery({
    queryKey: ['top-menus', currency],
    queryFn: async ({ queryKey }) => {
      const [_, currency] = queryKey;
      const response = await fetch({
        url: `admin/top-menus?currency=${currency}`,
        method: 'GET'
      });
      return response.data as GetTopMenus;
    }
  });
}

export function useFetchMenuQuery(id: string) {
  return useQuery({
    queryKey: ['menu', id],
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey;
      const response = await fetch({
        url: `menus/get-menu-detail/${id}`,
        method: 'GET'
      });
      return (response.data as GetMenuResponse).data;
    },
    enabled: !!id
  });
}

export function useUpdateMenuStatus() {
  return useMutation({
    mutationFn: (request: UpdateMenuStatusRequest) => {
      const id = request.menuId;
      return fetch({
        url: `/admin/approve-menus/${id}?menuId=${id}&status=${request.status}&${request.message ? `message=${request.message}` : ''}`,
        method: 'GET'
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['menu'] });
    }
  });
}
