import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api';
import { useMemo, useState } from 'react';
import { GetAllMenusResponse } from '../data/dto.ts';
import { UpdateMenuStatusRequest } from './types.ts';

export function useFetchMenusQuery() {
  const filters = useMemo(() => ['all', 'approved', 'unapproved'], []);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string>();
  const [filter, setFilter] = useState<string>(filters[0]);

  const { isPending, data, error } = useQuery({
    queryKey: ['menu', page, filter],
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, page, filter] = queryKey;
      const response = await fetch({
        url: `admin/get-menus?page_number=${page}${filter === 'all' ? '' : `&menu_status=${filter}`}&page_size=20`,
        method: 'GET'
      });
      return response.data as GetAllMenusResponse;
    }
  });

  const menus = useMemo(() => {
    const items = data?.data?.items || [];
    if (!query) {
      return items;
    }
    return items.filter((menu) => {
      const cleanedQuery = query!.toLowerCase();
      return (
        menu.menuName.toLowerCase().includes(cleanedQuery) ||
        menu.chefID.first_name.toLowerCase().includes(cleanedQuery) ||
        menu.chefID.last_name.toLowerCase().includes(cleanedQuery)
      );
    });
  }, [query, data]);

  return {
    isPending,
    error,
    page,
    setPage,
    menus,
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    totalCount: data?.data?.total_count || 0,
    numberOfPages: data?.data?.number_of_pages || 0
  };
}

export function useUpdateMenuStatus() {
  return useMutation({
    mutationFn: (request: UpdateMenuStatusRequest) => {
      return fetch({
        url: `/admin/approve-menus/${request.id}?status=${request.status}&${request.reason ? `reason=${request.reason}` : ''}`,
        method: 'GET'
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['menu'] });
    }
  });
}
