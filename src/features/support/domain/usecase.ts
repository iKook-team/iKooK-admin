import { useMemo } from 'react';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api.ts';
import { GetAllSupportTicketsResponse } from './dto.ts';
import { SupportTicket, SupportTicketMessage } from './types.ts';
import { parseAsInteger, useQueryState } from 'nuqs';
import { toast } from 'react-toastify';
import { UserType } from '../../users/domain/types.ts';

function useQueryInfo() {
  const filters = useMemo(() => ['All', 'Open', 'Closed', 'In Progress'], []);

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
    url: `supports/tickets?page=${page}&page_size=20${filter !== 'All' ? `&status=${filter}` : ''}${query ? `&search=${query}` : ''}`,
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
    tickets: data?.data?.results ?? [],
    totalCount: data?.data?.count ?? 0,
    numberOfPages: data?.data?.total ?? 0
  };
}

export function useGetSupportTicket(ticketId: number | null) {
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
          return acc.concat(query.state.data?.data?.results ?? []);
        }, [])
        // @ts-expect-error - ignoring for now
        ?.find((ticket) => ticket.id === ticketId) as SupportTicket | undefined
    );
  }, [data, ticketId]);
}

export function useGetSupportTicketMessages(id: number | string | null) {
  return useQuery({
    queryKey: ['support', id],
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey;
      const response = await fetch({
        url: `supports/tickets/messages?page=1&page_size=1000&ticket=${id}`,
        method: 'GET'
      });
      return (response.data?.data?.results ?? []) as SupportTicketMessage[];
    },
    enabled: !!id
  });
}

export function useReplyTicket(ticketId: number | null) {
  return useMutation({
    mutationFn: (message: string) => {
      // add message directly to the cache so we won't need to refetch the data
      queryClient.setQueryData(['support', ticketId], (prev: any) => {
        if (!prev) {
          return prev;
        }
        const lastMessage = prev?.messages?.[prev?.messages?.length - 1];
        const newMessage: SupportTicketMessage = {
          id: (lastMessage?.id ?? 0) + 1,
          message,
          // @ts-expect-error - ignoring for now
          sender: {
            user_type: UserType.admin
          },
          created_at: new Date().toISOString(),
          ticket: ticketId!
        };
        return [...prev, newMessage];
      });

      return fetch({
        url: `/supports/tickets/messages/`,
        method: 'POST',
        data: {
          ticket: ticketId,
          message
        }
      });
    }
  });
}

export function useCloseTicket(id: number | null) {
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
