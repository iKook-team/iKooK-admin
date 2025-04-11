import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api';
import { GetAllBookingsResponse } from '../data/dto.ts';
import { useMemo, useState } from 'react';
import { GenericResponse } from '../../../app/data/dto.ts';
import { Booking, BookingStatus } from '../data/model.ts';
import { toast } from 'react-toastify';
import { BookingType } from './types.ts';
import { parseAsInteger, useQueryState } from 'nuqs';
import useDebouncedValue from '../../../hooks/useDebouncedValue.ts';

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

export function useFetchBookingQuery(id: string) {
  const { isPending, data, error } = useQuery({
    queryKey: [id],
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [id] = queryKey;
      const response = await fetch({
        url: `bookings/get-booking-details/${id}`,
        method: 'GET'
      });
      return response?.data as GenericResponse<Booking>;
    }
  });

  return {
    isPending,
    booking: data?.data,
    error
  };
}

export function useEditBookingStatus() {
  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      return fetch({
        url: `admin/update-booking-status/${bookingId}?booking_status=${status}`,
        method: 'GET'
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });
}

export function useDeleteBooking() {
  return useMutation({
    mutationFn: async ({ bookingId }: { bookingId: string }) => {
      return await fetch({
        url: `admin/delete-booking/${bookingId}`,
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });
}

export function useReassignBooking() {
  return useMutation({
    mutationFn: async ({ chefId, bookingId }: { chefId: string; bookingId: string }) => {
      return fetch({
        url: 'admin/reassign-booking',
        method: 'POST',
        data: {
          chefId: chefId,
          bookingId: bookingId
        }
      });
    },
    onSuccess: () => {
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
