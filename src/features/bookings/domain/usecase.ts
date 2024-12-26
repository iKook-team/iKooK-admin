import { useMutation, useQuery } from '@tanstack/react-query';
import fetch, { queryClient } from '../../../app/services/api';
import { GetAllBookingsResponse } from '../data/dto.ts';
import { useMemo, useState } from 'react';
import { GenericResponse } from '../../../app/data/dto.ts';
import { Booking, Bookings } from '../data/model.ts';
import { toast } from 'react-toastify';
import { BookingType } from './types.ts';

export function useFetchBookingsQuery() {
  const filters = useMemo(() => ['all', 'processing', 'pending', 'enquiry', 'completed'], []);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string>();
  const [filter, setFilter] = useState<string>(filters[0]);
  const [bookingType, setBookingType] = useState<BookingType>(BookingType.menus);

  const { isPending, data, error } = useQuery({
    queryKey: ['bookings', bookingType, page],
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, bookingType, page] = queryKey;
      const response = await fetch({
        url: `admin/get-bookings?type=${bookingType}&page_number=${page}&page_size=20`,
        method: 'GET'
      });
      return response.data as GetAllBookingsResponse;
    }
  });

  const bookings = useMemo(() => {
    const items = data?.data?.items || [];
    if (!query && (!filter || filter === 'all')) {
      return items;
    }

    return items.filter((booking) => {
      let cleanedQuery = '';
      if (query) {
        cleanedQuery = query.toLowerCase();

        return (
          booking.user?.firstName.toLowerCase().includes(cleanedQuery) ||
          booking.user?.lastName.toLowerCase().includes(cleanedQuery) ||
          booking.chef?.lastName.toLowerCase().includes(cleanedQuery) ||
          booking.chef?.firstName.toLowerCase().includes(cleanedQuery)
        );
      } else if (query && filter != 'all') {
        const cleanedFilter = filter!.toLowerCase();

        return (
          booking.user?.firstName.toLowerCase().includes(cleanedQuery) ||
          booking.user?.lastName.toLowerCase().includes(cleanedQuery) ||
          booking.chef?.lastName.toLowerCase().includes(cleanedQuery) ||
          (booking.chef?.firstName.toLowerCase().includes(cleanedQuery) &&
            booking.status.toLowerCase() === cleanedFilter)
        );
      }
      const cleanedFilter = filter!.toLowerCase();
      return booking.status.toLowerCase() === cleanedFilter;
    });
  }, [query, filter, data]);

  return {
    bookingType,
    setBookingType,
    isPending,
    error,
    page,
    setPage,
    bookings,
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    totalCount: data?.data?.total_count || 0,
    numberOfPages: data?.data?.number_of_pages || 0
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
        url :     `admin/update-booking-status/${bookingId}?booking_status=${status}`,
        method: 'GET',
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
      void queryClient.invalidateQueries({ queryKey: ["booking"] });
    }
  });
}

export function useReassignBooking(booking: Bookings) {
  return useMutation({
    mutationFn: async ({ chefId, bookingId }: { chefId: string; bookingId: string }) => {
      return fetch({
        url: 'admin-reassign-booking',
        method: 'POST',
        data: { chefId, bookingId }
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [booking] });
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
