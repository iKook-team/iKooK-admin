import { useQuery } from '@tanstack/react-query';
import fetch from '../../../app/services/api';
import { GetAllBookingsResponse } from '../data/dto.ts';
import { useMemo, useState } from 'react';
import { BookingType } from './types.ts';

export function useFetchBookingsQuery() {
  const filters = useMemo(() => ['all', 'in progress', 'completed', 'pending'], []);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string>();
  const [filter, setFilter] = useState<string>(filters[0]);
  const [bookingType, setBookingType] = useState<BookingType>(BookingType.enquiries);

  const { isPending, data, error } = useQuery({
    queryKey: [bookingType],
    queryFn: async ({ queryKey }) => {
      const [bookingType] = queryKey;
      const response = await fetch({
        url: `admin/get-bookings?page_number=${page}&type=${bookingType}&page_size=20`,
        method: 'GET'
      });
      return response.data as GetAllBookingsResponse;
    }
  });

  const bookings = useMemo(() => {
    const items = data?.data?.items || [];
    if (!query) {
      return items;
    }

    return items.filter((booking) => {
      const cleanedQuery = query!.toLowerCase();
      return (
        booking.user.firstName.toLowerCase().includes(cleanedQuery) ||
        booking.user.lastName.toLowerCase().includes(cleanedQuery)
      );
    });
  }, [query, data]);

  return {
    isPending,
    bookings,
    error,
    page,
    setPage,
    query,
    setQuery,
    filter,
    setFilter,
    filters,
    bookingType,
    setBookingType,
    totalCount: data?.data?.total_count || 0,
    numberOfPages: data?.data?.number_of_pages || 0
  };
}
