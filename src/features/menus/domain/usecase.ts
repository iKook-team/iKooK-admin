import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api';
import { useMemo, useState } from 'react';
import { GetAllMenusResponse, GetMenuResponse, GetTopMenus } from '../data/dto.ts';
import { UpdateMenuStatusRequest } from './types.ts';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';
import { MenuStatus } from '../data/model.ts';

export function useFetchMenusQuery() {
  const filters = useMemo(() => ['All', ...Object.values(MenuStatus)], []);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string>();
  const [filter, setFilter] = useState<string>(filters[0]);

  const debouncedQuery = useDebouncedValue(query, 500);

  const { isPending, data, error } = useQuery({
    queryKey: ['menus', page, filter, debouncedQuery],
    queryFn: async ({ queryKey }) => {
      const [_, page, filter, query] = queryKey;
      const response = await fetch({
        url: `menus?page=${page}${filter === 'All' ? '' : `&status=${filter}`}&page_size=20${query ? `&search=${query}` : ''}`,
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
    menus: data?.data?.results ?? [],
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    totalCount: data?.data?.count ?? 0,
    numberOfPages: data?.data?.total ?? 0
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
