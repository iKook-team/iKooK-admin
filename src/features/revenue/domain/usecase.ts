import { useQuery } from '@tanstack/react-query';
import fetch from '../../../app/services/api.ts';
import {
  GetAllPaymentsResponse,
  GetRevenueInsightsResponse,
  GetRevenueOverviewResponse
} from './dto.ts';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';
import { useMemo } from 'react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { DateTime } from 'luxon';

export function useFetchRevenueOverviewQuery() {
  return useQuery({
    queryKey: ['revenue', 'overview'],
    queryFn: async () => {
      const response = await fetch({
        url: `payments/revenue-overview/`,
        method: 'GET'
      });
      return response.data as GetRevenueOverviewResponse;
    }
  });
}

export function useFetchRevenueInsightsQuery(filter: string) {
  return useQuery({
    queryKey: ['revenue', 'insights', filter],
    queryFn: async ({ queryKey }) => {
      const [_, __, filter] = queryKey;
      const end_date = DateTime.now().toFormat('yyyy-MM-dd');
      const start_date = DateTime.now()
        .minus({
          weeks: filter === 'weekly' ? 1 : undefined,
          months: filter === 'monthly' ? 1 : undefined
        })
        .toFormat('yyyy-MM-dd');
      const response = await fetch({
        url: `payments/revenue-chart/`,
        method: 'POST',
        data: {
          mode: filter,
          start_date,
          end_date
        }
      });
      return response.data.data as GetRevenueInsightsResponse;
    }
  });
}

export function useFetchPaymentsQuery() {
  const filters = useMemo(() => ['all', 'failed', 'pending', 'success'], []);
  const [filter, setFilter] = useQueryState('status', {
    defaultValue: filters[0]
  });
  const [query, setQuery] = useQueryState('search', {
    defaultValue: ''
  });
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const search = useDebouncedValue(query, 500);

  const { isPending, data, error } = useQuery({
    queryKey: ['payments', filter, page, search],
    queryFn: async ({ queryKey }) => {
      const [_, status, page, search] = queryKey;
      const response = await fetch({
        url: `admin/get-payments?page_number=${page}&page_size=20${status === 'all' ? '' : `&status=${status}`}${search ? `&search=${search}` : ''}`,
        method: 'GET'
      });
      return response.data as GetAllPaymentsResponse;
    }
  });

  return {
    isPending,
    error,
    page,
    setPage,
    payments: data?.data?.results ?? [],
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    totalCount: data?.data?.count ?? 0,
    numberOfPages: data?.data?.total ?? 0
  };
}
