import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import fetch from '../../../app/services/api.ts';
import { ReportType } from './types.ts';
import { parseAsInteger, useQueryState } from 'nuqs';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';
import { GetAllReportsResponse } from '../data/dto.ts';

export function useFetchReportsQuery() {
  const [tab, setTab] = useQueryState('type', {
    defaultValue: ReportType.chef
  });

  const filters = useMemo(() => ['all', 'needs response', 'responded'], []);
  const [filter, setFilter] = useQueryState('filter', {
    defaultValue: filters[0]
  });

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [query, setQuery] = useQueryState('search', {
    defaultValue: ''
  });

  const search = useDebouncedValue(query, 500);

  const { isPending, data, error } = useQuery({
    queryKey: ['reports', tab, filter, search, page],
    queryFn: async ({ queryKey }) => {
      const [_, tab, filter, search, page] = queryKey;
      const baseUrl = tab === ReportType.chef ? 'chef/get-reported-chefs' : 'menus/reported-menus';
      const responded =
        filter === 'responded' ? true : filter === 'needs response' ? false : undefined;
      const response = await fetch({
        url: `${baseUrl}?page_number=${page}&page_size=20${search ? `&search=${search}` : ''}${responded ? `&responded=${responded}` : ''}`,
        method: 'GET'
      });
      return response.data as GetAllReportsResponse;
    }
  });

  return {
    tab: tab as ReportType,
    setTab,
    isPending,
    error,
    page,
    setPage,
    reports: data?.data?.items ?? [],
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    totalCount: data?.data?.total_count ?? 0,
    numberOfPages: data?.data?.number_of_pages ?? 0
  };
}
