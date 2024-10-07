import { useQuery } from '@tanstack/react-query';
import fetch from '../../../app/services/api';
import { useMemo, useState } from 'react';
import { GetAllMenusResponse } from '../data/dto.ts';

export function useFetchMenusQuery() {
  const filters = useMemo(() => ['all', 'approved', 'unapproved'], []);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string>();
  const [filter, setFilter] = useState<string>(filters[0]);

  const { isPending, data, error } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
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
    filters
  };
}
