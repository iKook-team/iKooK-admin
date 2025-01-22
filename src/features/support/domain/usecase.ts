import { useMemo, useState } from 'react';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';
import { useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api.ts';
import { GetAllSupportTicketsResponse } from './dto.ts';
import { SupportTicket } from './types.ts';

export function useFetchSupportTicketsQuery() {
  const filters = useMemo(() => ['all', 'open', 'closed', 'in-progress'], []);

  const [filter, setFilter] = useState<string>(filters[0]);
  const [query, setQuery] = useState<string>();
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebouncedValue(query, 500);

  const { isPending, data, error } = useQuery({
    queryKey: ['support', filter, page, debouncedQuery],
    queryFn: async ({ queryKey }) => {
      const [_, filter, page, query] = queryKey;
      const response = await fetch({
        url: `support/get-all-tickets?page_number=${page}&page_size=20${filter !== 'all' ? `&status=${filter}` : ''}${query ? `&search_name=${query}` : ''}`,
        method: 'GET'
      });
      return response.data as GetAllSupportTicketsResponse;
    }
  });

  return {
    isPending,
    error,
    page,
    setPage,
    tickets: data?.data?.items ?? [],
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    totalCount: data?.data?.total_count || 0,
    numberOfPages: data?.data?.number_of_pages || 0
  };
}

export function useGetSupportTicket(ticketId: string) {
  return useMemo(() => {
    return (
      queryClient
        .getQueryCache()
        .findAll({ queryKey: ['support'] })
        .reduce((acc, query) => {
          // @ts-expect-error - ignoring for now
          return acc.concat(query.state.data?.data?.items ?? []);
        }, [])
        // @ts-expect-error - ignoring for now
        ?.find((ticket) => ticket.ticket_id === ticketId) as SupportTicket | undefined
    );
  }, [ticketId]);
}
