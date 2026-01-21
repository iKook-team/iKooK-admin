import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api';
import { Ref, useMemo, useState } from 'react';
import { GetAllMenusResponse, GetMenuResponse, GetTopMenus } from '../data/dto.ts';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';
import { Menu, MenuStatus } from '../data/model.ts';
import { toast } from 'react-toastify';
import { getCurrentFromRef } from '../../../utils/ref.ts';

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

export function useFetchTopMenusQuery() {
  return useQuery({
    queryKey: ['top-menus'],
    queryFn: async () => {
      const response = await fetch({
        url: `menus/top-performing/`,
        method: 'GET'
      });
      return response.data as GetTopMenus;
    }
  });
}

export function useFetchMenuQuery(slug?: string) {
  return useQuery({
    queryKey: ['menu', slug],
    queryFn: async ({ queryKey }) => {
      const [_, slug] = queryKey;
      const response = await fetch({
        url: `menus/${slug}/`,
        method: 'GET'
      });
      return (response.data as GetMenuResponse).data;
    },
    enabled: !!slug
  });
}

export function useUpdateMenu(ref?: Ref<any>) {
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<Menu> }) => {
      return fetch({
        url: `/menus/${slug}/`,
        method: 'PATCH',
        data
      });
    },
    onSuccess: (response, request) => {
      toast(response.data.message, { type: 'success' });
      if (ref) {
        getCurrentFromRef(ref)?.close();
      }
      void queryClient.invalidateQueries({ queryKey: ['menus'] });
      void queryClient.invalidateQueries({ queryKey: ['menu', request.slug] });
    }
  });
}
