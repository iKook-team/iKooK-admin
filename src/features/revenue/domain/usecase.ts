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

export function useFetchRevenueOverviewQuery(currency: string) {
  return useQuery({
    queryKey: ['revenue', currency, 'overview'],
    queryFn: async ({ queryKey }) => {
      const [_, currency] = queryKey;
      const response = await fetch({
        url: `admin/revenue-overview?currency=${currency}`,
        method: 'GET'
      });
      return response.data as GetRevenueOverviewResponse;
    }
  });
}

export function useFetchRevenueInsightsQuery(currency: string, filter: string) {
  return useQuery({
    queryKey: ['revenue', currency, 'insights', filter],
    queryFn: async ({ queryKey }) => {
      const [_, currency, __, filter] = queryKey;
      const response = await fetch({
        url: `admin/revenue-insight?currency=${currency}${filter ? `&filter=${filter}` : ''}`,
        method: 'GET'
      });
      return response.data as GetRevenueInsightsResponse;
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
    payments: data?.data?.items ?? [],
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    totalCount: data?.data?.total_count ?? 0,
    numberOfPages: data?.data?.number_of_pages ?? 0
  };
}
