import { useMutation, useQuery } from '@tanstack/react-query';
import fetch from '../../../app/services/api';
import { GetAllBookingsResponse } from '../data/dto.ts';
import { useMemo, useState } from 'react';
import { GenericResponse } from '../../../app/data/dto.ts';
import { Booking } from '../data/model.ts';
import { toast } from 'react-toastify';
import { User } from '../../users/data/model.ts';


export function useFetchBookingsQuery() {
  const filters = useMemo(() => ['all', 'processing', 'pending', 'enquiry', 'completed'], []);

  const bookingTypes = useMemo(() => ['menu', 'enquiries'], []);

  const [bookingType, setBookingType] = useState<string>(bookingTypes[0]);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string>();
  const [filter, setFilter] = useState<string>(filters[0]);

  const { isPending, data, error } = useQuery({
    queryKey: ['bookings', bookingType, page],
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, bookingType, page] = queryKey;
      const response = await fetch({
        url: `admin/get-bookings?type=${bookingType}&page_number=${page}&page_size=${20}`,
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
    bookingTypes,
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


export function useFetchUsersQuery() {
  const [query, setQuery] = useState<string>("");


  const { isPending, data, error } = useQuery({
    queryKey: ["chefs"],
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [] = queryKey;
      const response = await fetch({
        url: `admin/get-all-users?user_type=chef`,
        method: 'GET'
      });
      return response?.data as GenericResponse<User[]>;
    }
  });

  const users = useMemo(() => {
    const items = data?.data || [];
    if (!query.trim()) {
      return items;
    }

    const cleanedQuery = query.toLowerCase();


    return items.filter((chef) =>
      [chef.first_name, chef.last_name].some((field) =>
        field.toLowerCase().includes(cleanedQuery)
      )
    );

  }, [query, data]);

  return {
    isPending,
    users ,
    error,
    query, 
    setQuery
  };
}





export function useEditBookingStatus() {
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const response = await fetch({
        url: `admin/update-booking-status/${bookingId}`,
        method: 'GET',
        data: { status }
      });
      return response.data;
    }
  });

  return {
    performEditStatus: async (bookingId: string, status: string) => {
      if (loading) {
        return;
      }

      try {
        setLoading(true);
        await mutation.mutateAsync({ bookingId, status });
        toast(`Booking status updated successfully`, { type: 'success' });
      } catch (error) {
        toast(`Failed to update booking status`, { type: 'error' });
      } finally {
        setLoading(false);
      }
    },
    loading
  };
}



export function useDeleteBooking() {
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await fetch({
        url: `admin/delete-booking/${bookingId}`,
        method: 'DELETE'
      });
      return response.data;
    }
  });

  return {
    performDelete: async (bookingId: string) => {
      if (loading) {
        return;
      }

      try {
        setLoading(true);
        await mutation.mutateAsync(bookingId);
        toast(`Booking deleted successfully`, { type: 'success' });
      } catch (error) {
        toast(`Failed to delete booking`, { type: 'error' });
      } finally {
        setLoading(false);
      }
    },
    loading
  };
}


export function useReassignBooking() {
  const [loading, setLoading] = useState(false);

  // Define the mutation function
  const mutation = useMutation({
    mutationFn: async ({ chefId, bookingId }: { chefId: string; bookingId: string }) => {
      const response = await fetch({
        url: 'admin-reassign-booking',
        method: 'POST',
        data: { chefId, bookingId },
      });
      return response.data;
    },
  });

  return {
    performReassign: async ({ chefId, bookingId }: { chefId: string; bookingId: string }) => {
      if (loading) {
        return;
      }

      try {
        setLoading(true);
        await mutation.mutateAsync({ chefId, bookingId });
        toast(`Booking successfully reassigned`, { type: 'success' });
      } catch (error) {
        toast(`Failed to reassign booking`, { type: 'error' });
      } finally {
        setLoading(false);
      }
    },
    loading,
  };
}


export function useAcceptQuote() {
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({ quoteId }: { quoteId: string; }) => {
      const response = await fetch({
        url: `quotes/accept-quote/${quoteId}`,
        method: 'GET',
        // data: { quoteId }
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