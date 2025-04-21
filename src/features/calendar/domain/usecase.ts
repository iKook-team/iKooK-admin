import { parseAsInteger, useQueryState } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import fetch from '../../../app/services/api.ts';
import { getWeekNumber } from '../../../utils/helper.ts';
import { GetCalendarResponse } from './dto.ts';
import { DateTime } from 'luxon';

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
      // @ts-expect-error nothing will happen
      const start = DateTime.fromObject({ weekYear: year, weekNumber: week }).startOf('week');
      const end = start.endOf('week');

      const response = await fetch({
        url: `calendar/time-slots?page_size=100&start_date=${start.toFormat('yyyy-MM-dd')}&end_date=${end.toFormat('yyyy-MM-dd')}`,
        method: 'GET'
      });
      return response.data as GetCalendarResponse;
    }
  });

  return {
    calendar: data?.results,
    isPending,
    error,
    week,
    setWeek,
    year,
    setYear
  };
}
