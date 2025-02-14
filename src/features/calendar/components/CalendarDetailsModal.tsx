import { CalendarDay } from '../domain/types.ts';
import { Ref, useMemo } from 'react';
import { ReactSVG } from 'react-svg';
import close from '../../../app/assets/icons/close.svg';
import { convertTo12Hour, getDateFrom, hoursInDate } from '../../../utils/helper.ts';
import { fromKebabCase } from '../../../utils/strings.ts';
import { Link } from 'react-router-dom';
import { BookingType } from '../../bookings/domain/types.ts';

interface CalendarDetailsModalProps {
  ref: Ref<HTMLDialogElement>;
  data?: CalendarDay;
  hours?: number[];
  week: number;
  year: number;
}

export default function CalendarDetailsModal({
  ref,
  data,
  hours,
  week,
  year
}: CalendarDetailsModalProps) {
  const date = useMemo(() => {
    const month = getDateFrom(data?.date ?? 1, week, year).toFormat('MMMM');
    return `${data?.date} ${month} ${year}`;
  }, [data?.date, week, year]);
  const bookings = useMemo(
    () => data?.bookings.filter((booking) => hoursInDate(hours ?? [], booking.date)),
    [data?.bookings, hours]
  );
  return (
    <dialog id="calendar-details-modal" ref={ref} className="modal">
      <div className="modal-box px-0 py-4.5 w-fit">
        <div className="uppercase flex flex-row justify-between mb-4 border-b border-black-base/10 pl-6 pr-4">
          <div>
            <h3 className="text-sm font-medium">{date}</h3>
            <p className="text-[0.625rem] leading-[20px] mb-1">
              {data?.day}, {hours?.[0] === 0 ? '12' : hours?.[0]} -{' '}
              {convertTo12Hour(hours?.[hours?.length - 1] ?? 0)}
            </p>
          </div>
          <form method="dialog">
            <button>
              <ReactSVG src={close} wrapper="span" className="w-4 h-4" />
            </button>
          </form>
        </div>
        <div className="pt-1.5 px-4 flex flex-col gap-2.5">
          <h4 className="text-xs font-medium">Bookings</h4>
          {bookings &&
            bookings.map((booking, index) => {
              const i = index + 1;
              const border =
                i % 2 === 0
                  ? 'border-green'
                  : i % 3 === 0
                    ? 'border-red-base'
                    : 'border-blue-dark-imperial';
              const background =
                i % 2 === 0
                  ? 'bg-green/5'
                  : i % 3 === 0
                    ? 'bg-red-base/5'
                    : 'bg-blue-dark-imperial/5';
              return (
                <Link
                  key={booking.id}
                  className={`flex flex-row items-center gap-2.5 px-2 py-2.5 border ${border} rounded-sm ${background} text-xs font-medium`}
                  to={`/bookings/${booking.id}?type=${BookingType.menus}`}
                >
                  <span className="capitalize">
                    {booking.user.first_name} {booking.user.last_name}
                  </span>
                  <span className="text-[0.625rem] font-normal">
                    {fromKebabCase(booking.booking_type)} booking
                  </span>
                  <span>
                    with <span className="capitalize">Chef {booking.chef.first_name}</span>
                  </span>
                </Link>
              );
            })}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
