import { parseAsInteger, useQueryState } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import fetch from '../../../app/services/api.ts';
import { getWeekNumber } from '../../../utils/helper.ts';
import { GetCalendarResponse } from './dto.ts';

export function useFetchCalendarQuery() {
  const [week, setWeek] = useQueryState(
    'week',
    parseAsInteger.withDefault(getWeekNumber(new Date()))
  );

  const [year, setYear] = useQueryState(
    'year',
    parseAsInteger.withDefault(new Date().getFullYear())
  );

  const { isPending, data, error } = useQuery({
    queryKey: ['calendar', year, week],
    queryFn: async ({ queryKey }) => {
      const [_, year, week] = queryKey;
      const response = await fetch({
        url: `admin/calendar?week=${week}&year=${year}`,
        method: 'GET'
      });
      return response.data as GetCalendarResponse;
    }
  });

  return {
    calendar: data?.data,
    isPending,
    error,
    week,
    setWeek,
    year,
    setYear
  };
}
