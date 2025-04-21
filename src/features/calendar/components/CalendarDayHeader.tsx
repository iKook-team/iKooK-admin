import { DateTime } from 'luxon';

interface CalendarDayHeaderProps {
  date: DateTime;
  className?: string;
}

export default function CalendarDayHeader({ date, className }: CalendarDayHeaderProps) {
  return (
    <div
      className={`flex flex-col text-dark-charcoal/70 font-medium text-xs leading-[18px] text-center ${className ?? ''}`}
    >
      <p>{date.toFormat('MMM')}</p>
      <p className="text-3xl leading-[45px]">{date.toFormat('dd')}</p>
      <p>{date.toFormat('ccc').toUpperCase()}</p>
    </div>
  );
}
