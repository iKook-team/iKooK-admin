import { useMemo } from 'react';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api.ts';
import { GetAllSupportTicketsResponse } from './dto.ts';
import { SupportTicket } from './types.ts';
import { parseAsInteger, useQueryState } from 'nuqs';
import { toast } from 'react-toastify';

function useQueryInfo() {
  const filters = useMemo(() => ['all', 'open', 'closed', 'in-progress'], []);

  const [page, setPage] = useQueryState<number>('page', parseAsInteger.withDefault(1));
  const [filter, setFilter] = useQueryState('filter', {
    defaultValue: filters[0]
  });
  const [query, setQuery] = useQueryState('query', {
    defaultValue: ''
  });
  const debouncedQuery = useDebouncedValue(query, 500);

  return {
    queryKey: ['support', filter, page, debouncedQuery],
    filter,
    setFilter,
    page,
    setPage,
    query,
    setQuery,
    filters
  };
}

async function fetchTickets({ queryKey }: { queryKey: (string | number)[] }) {
  const [_, filter, page, query] = queryKey;
  const response = await fetch({
    url: `support/get-all-tickets?page_number=${page}&page_size=20${filter !== 'all' ? `&status=${filter}` : ''}${query ? `&search_name=${query}` : ''}`,
    method: 'GET'
  });
  return response.data as GetAllSupportTicketsResponse;
}

export function useFetchSupportTicketsQuery() {
  const queryInfo = useQueryInfo();

  const { isPending, data, error } = useQuery({
    queryKey: queryInfo.queryKey,
    queryFn: fetchTickets
  });

  return {
    isPending,
    error,
    ...queryInfo,
    tickets: data?.data?.items ?? [],
    totalCount: data?.data?.total_count || 0,
    numberOfPages: data?.data?.number_of_pages || 0
  };
}

export function useGetSupportTicket(ticketId: string) {
  const { queryKey } = useQueryInfo();
  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: fetchTickets
  });

  return useMemo(() => {
    if (!ticketId) {
      return undefined;
    }
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
  }, [data, ticketId]);
}

export function useReplyTicket(ticketId: string) {
  const { queryKey } = useQueryInfo();

  return useMutation({
    mutationFn: (message: string) => {
      // add message directly to the cache so we won't need to refetch the data
      queryClient.setQueryData(queryKey, (prev: any) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          data: {
            ...prev.data,
            items: prev.data.items.map((ticket: SupportTicket) => {
              if (ticket.ticket_id === ticketId) {
                return {
                  ...ticket,
                  replies: [
                    ...ticket.replies,
                    {
                      message,
                      is_admin: true,
                      created_at: new Date().toISOString()
                    }
                  ]
                };
              }
              return ticket;
            })
          }
        };
      });

      return fetch({
        url: `/support/reply-ticket`,
        method: 'POST',
        data: {
          ticket: ticketId,
          message
        }
      });
    }
  });
}

export function useCloseTicket(id: string) {
  return useMutation({
    mutationFn: () => {
      return fetch({
        url: `/support/close-tickets/${id}`,
        method: 'POST'
      });
    },
    onSuccess: (response) => {
      toast(response.data.data ?? 'Ticket closed', { type: 'success' });
      void queryClient.invalidateQueries({ queryKey: ['support'] });
    }
  });
}
