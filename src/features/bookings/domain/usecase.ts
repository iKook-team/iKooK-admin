import { useQuery } from '@tanstack/react-query';
import fetch from '../../../app/services/api';
import { GetAllBookingsRequest, GetAllBookingsResponse } from '../data/dto.ts';
import { useMemo } from 'react';
import { GenericResponse } from '../../../app/data/dto.ts';
import { Booking } from '../data/model.ts';
import { bookingType, UserType } from '../../users/domain/types.ts';

export function useFetchBookingsQuery(request: GetAllBookingsRequest) {
 
  const { isPending, data, error } = useQuery({
    queryKey: [request.bookingType],
    queryFn: async ({ queryKey }) => {
      const [bookingType] = queryKey;
      const response = await fetch({
        // url: `admin/get-all-users?user_type=${type}${verified !== undefined ? `&verified=${verified}` : ''}`,
                url: `admin/get-bookings?type=${bookingType}`,   
                // url: `admin/get-bookings?type=enquiries`,



        method: 'GET'
      });
      return response.data as GetAllBookingsResponse;
    }
  });

  const bookings = useMemo(() => {
    if (!request.query || !data) {
      return data?.data || [];
    }

    return data?.data?.filter((booking) => {
      const cleanedQuery = request.query!.toLowerCase();
      return (
        booking.user.firstName.toLowerCase().includes(cleanedQuery) ||
        booking.user.lastName.toLowerCase().includes(cleanedQuery)
      );
    });
  }, [request.query, data]);

  return {
    isPending,
    bookings,
    error
  };
}

export function useFetchBookingQuery(type: bookingType, id: string) {
  const { isPending, data, error } = useQuery({
    queryKey: [type, id],
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, id] = queryKey;
      const response = await fetch({
        url: `admin/edit-booking/${id}`,
        method: 'GET'
      });
      return response.data as GenericResponse<Booking>;
    }
  });

  return {
    isPending,
    booking: data?.data,
    error
  };
}
