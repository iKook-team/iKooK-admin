import { useMemo } from 'react';
import { getDateFrom } from '../../../utils/helper.ts';

interface CalendarDayHeaderProps {
  day: number;
  name: string;
  week: number;
  year: number;
  className?: string;
}

export default function CalendarDayHeader({
  name,
  day,
  week,
  year,
  className
}: CalendarDayHeaderProps) {
  const month = useMemo(() => getDateFrom(day, week, year).toFormat('MMM'), [day, week, year]);
  return (
    <div
      className={`flex flex-col text-dark-charcoal/70 font-medium text-xs leading-[18px] text-center ${className ?? ''}`}
    >
      <p>{month}</p>
      <p className="text-3xl leading-[45px]">{day}</p>
      <p>{name?.toUpperCase()}</p>
    </div>
  );
}
