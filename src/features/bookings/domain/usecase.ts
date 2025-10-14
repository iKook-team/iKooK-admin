import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api';
import { GetAllBookingsResponse } from '../data/dto.ts';
import { Ref, useMemo, useState } from 'react';
import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';
import { Booking, BookingStatus, Quote } from '../data/model.ts';
import { toast } from 'react-toastify';
import { BookingType } from './types.ts';
import { parseAsInteger, useQueryState } from 'nuqs';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';
import { getCurrentFromRef } from '../../../utils/ref.ts';

export function useFetchBookingsQuery() {
  const filters = useMemo(() => ['All', ...Object.values(BookingStatus)], []);

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [query, setQuery] = useQueryState('search', {
    defaultValue: ''
  });

  const [filter, setFilter] = useState<string>(filters[0]);

  const debouncedQuery = useDebouncedValue(query, 500);

  const [bookingType, setBookingType] = useQueryState('type', {
    defaultValue: BookingType.menus
  });

  const { isPending, data, error } = useQuery({
    queryKey: ['bookings', bookingType, filter, page, debouncedQuery],
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, type, status, page, query] = queryKey;
      const response = await fetch({
        url: `bookings/?page=${page}&page_size=20&booking_type=${type}${query ? `&search=${query}` : ''}${status && status !== 'All' ? `&status=${status}` : ''}`,
        method: 'GET'
      });
      return response.data as GetAllBookingsResponse;
    }
  });

  return {
    bookingType: bookingType as BookingType,
    setBookingType,
    isPending,
    error,
    page,
    setPage,
    bookings: data?.data?.results ?? [],
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    totalCount: data?.data?.count ?? 0,
    numberOfPages: data?.data?.total ?? 0
  };
}

export function useFetchBookingQuery(type: BookingType, id?: number | string) {
  const query = useQuery({
    queryKey: ['bookings', type, id],
    queryFn: async ({ queryKey }) => {
      const [_, __, id] = queryKey;
      const response = await fetch({
        url: `bookings/${id}/?booking_type=${type}`,
        method: 'GET'
      });
      return response?.data as GenericResponse<Booking>;
    },
    enabled: !!id
  });

  return {
    ...query,
    data: query?.data?.data
  };
}

export function useFetchQuotesQuery(booking?: number | string) {
  const query = useQuery({
    queryKey: ['quotes', booking],
    queryFn: async ({ queryKey }) => {
      const [_, __, id] = queryKey;
      const response = await fetch({
        url: `quotes/${id}?page=1&page_size=100`,
        method: 'GET'
      });
      return response?.data as GenericResponse<PagedResponse<Quote>>;
    },
    enabled: !!booking
  });

  return {
    ...query,
    data: query?.data?.data?.results
  };
}

export function useUpdateBooking(ref?: Ref<any>) {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Booking> }) => {
      return fetch({
        url: `/bookings/${id}/`,
        method: 'PATCH',
        data
      });
    },
    onSuccess: (response) => {
      toast(response.data.message, { type: 'success' });
      if (ref) {
        getCurrentFromRef(ref)?.close();
      }
      void queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });
}

export function useDeleteBooking(ref?: Ref<any>) {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      return await fetch({
        url: `bookings/${id}/`,
        method: 'DELETE'
      });
    },
    onSuccess: (response) => {
      toast(response.data.message, { type: 'success' });
      if (ref) {
        getCurrentFromRef(ref)?.close();
      }
      void queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });
}

export function useAcceptQuote() {
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({ quoteId }: { quoteId: string }) => {
      const response = await fetch({
        url: `quotes/accept-quote/${quoteId}`,
        method: 'GET'
      });
      return response.data;
    }
  });

  return {
    performAcceptQuote: async (quoteId: string) => {
      if (loading) {
        return;
      }

      try {
        setLoading(true);
        await mutation.mutateAsync({ quoteId });
        toast(`Quote Updated Successfully`, { type: 'success' });
      } catch (error) {
        toast(`Failed to Accept Quote`, { type: 'error' });
      } finally {
        setLoading(false);
      }
    },
    loading
  };
}
