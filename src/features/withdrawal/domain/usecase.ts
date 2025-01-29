import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api.ts';
import { parseAsInteger, useQueryState } from 'nuqs';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';
import { CreateWithdrawalRequest, GetAllWithdrawalsResponse } from './dto.ts';

export function useFetchWithdrawalsQuery() {
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
    queryKey: ['withdrawals', filter, page, search],
    queryFn: async ({ queryKey }) => {
      const [_, status, page, search] = queryKey;
      const response = await fetch({
        url: `chef/get-all-withdraw-request?page_number=${page}&page_size=20${status === 'all' ? '' : `&status=${status}`}${search ? `&search=${search}` : ''}`,
        method: 'GET'
      });
      return response.data as GetAllWithdrawalsResponse;
    }
  });

  return {
    isPending,
    error,
    page,
    setPage,
    withdrawals: data?.data?.items ?? [],
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    totalCount: data?.data?.total_count ?? 0,
    numberOfPages: data?.data?.number_of_pages ?? 0
  };
}

export function useCreateWithdrawal() {
  return useMutation({
    mutationFn: (data: CreateWithdrawalRequest) => {
      return fetch({
        url: `/chef/initiate-chef-withdraw-request`,
        method: 'POST',
        data
      });
    },
    onSuccess: () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ['withdrawals', 'all'] }),
        queryClient.invalidateQueries({ queryKey: ['withdrawals', 'success'] })
      ]);
    }
  });
}
