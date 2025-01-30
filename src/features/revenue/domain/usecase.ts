import { useQuery } from '@tanstack/react-query';
import fetch from '../../../app/services/api.ts';
import { GetRevenueOverviewResponse } from './dto.ts';

export function useFetchRevenueOverviewQuery(currency: string) {
  return useQuery({
    queryKey: ['revenue-overview', currency],
    queryFn: async ({ queryKey }) => {
      const [_, currency] = queryKey;
      const response = await fetch({
        url: `admin/revenue-overview?currency=${currency}`,
        method: 'GET'
      });
      return (response.data as GetRevenueOverviewResponse).data;
    }
  });
}
