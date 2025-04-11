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

  const filters = useMemo(() => ['All', 'Need Response', 'Responded', 'Resolved'], []);
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
      const [_, tab, status, search, page] = queryKey;
      const response = await fetch({
        url: `reports?type=${tab}&page=${page}&page_size=20${search ? `&search=${search}` : ''}${status && status !== 'All' ? `&status=${status}` : ''}`,
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
    reports: data?.data?.results ?? [],
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    totalCount: data?.data?.count ?? 0,
    numberOfPages: data?.data?.total ?? 0
  };
}
