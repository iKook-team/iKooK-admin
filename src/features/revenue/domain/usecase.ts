import { useQuery } from '@tanstack/react-query';
import fetch from '../../../app/services/api.ts';
import { GetRevenueInsightsResponse, GetRevenueOverviewResponse } from './dto.ts';

export function useFetchRevenueOverviewQuery(currency: string) {
  return useQuery({
    queryKey: ['revenue', currency, 'overview'],
    queryFn: async ({ queryKey }) => {
      const [_, currency] = queryKey;
      const response = await fetch({
        url: `admin/revenue-overview?currency=${currency}`,
        method: 'GET'
      });
      return response.data as GetRevenueOverviewResponse;
    }
  });
}

export function useFetchRevenueInsightsQuery(currency: string, filter: string) {
  return useQuery({
    queryKey: ['revenue', currency, 'insights', filter],
    queryFn: async ({ queryKey }) => {
      const [_, currency, __, filter] = queryKey;
      const response = await fetch({
        url: `admin/revenue-insight?currency=${currency}${filter ? `&filter=${filter}` : ''}`,
        method: 'GET'
      });
      return response.data as GetRevenueInsightsResponse;
    }
  });
}
