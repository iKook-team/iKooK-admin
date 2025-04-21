import { CalendarEntry } from '../domain/types.ts';
import { Ref } from 'react';
import { ReactSVG } from 'react-svg';
import close from '../../../app/assets/icons/close.svg';
import { fromKebabCase } from '../../../utils/strings.ts';
import { Link } from 'react-router-dom';
import { BookingType } from '../../bookings/domain/types.ts';
import { DateTime } from 'luxon';

interface CalendarDetailsModalProps {
  ref: Ref<HTMLDialogElement>;
  data?: CalendarEntry;
}

export default function CalendarDetailsModal({ ref, data }: CalendarDetailsModalProps) {
  const dateText = data?.start_date || data?.end_date;
  const date = dateText ? DateTime.fromISO(dateText) : null;
  return (
    <dialog id="calendar-details-modal" ref={ref} className="modal">
      <div className="modal-box px-0 py-4.5 w-fit min-w-[21rem]">
        <div className="uppercase flex flex-row justify-between mb-4 border-b border-black-base/10 pl-6 pr-4">
          {data && (
            <div>
              <h3 className="text-sm font-medium">{date?.toFormat('dd MMMM yyyy')}</h3>
              <p className="text-[0.625rem] leading-[20px] mb-1">
                {date?.toFormat('cccc').toUpperCase()},{' '}
                {DateTime.fromFormat(data.start_time, 'HH:mm:ss').toFormat('h a')} -
                {DateTime.fromFormat(data.end_time, 'HH:mm:ss').toFormat('h a')}
              </p>
            </div>
          )}
          <form method="dialog">
            <button>
              <ReactSVG src={close} wrapper="span" className="w-4 h-4" />
            </button>
          </form>
        </div>
        {data?.bookings && data.bookings.length > 0 && (
          <div className="pt-1.5 px-4 flex flex-col gap-2.5">
            <h4 className="text-xs font-medium">Bookings</h4>
            {data.bookings.map((booking, index) => {
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
                  <span className="capitalize">{booking.host}</span>
                  <span className="text-[0.625rem] font-normal">
                    {fromKebabCase(booking.service)} booking
                  </span>
                  {/*<span>*/}
                  {/*  with <span className="capitalize">Chef {booking.chef.first_name}</span>*/}
                  {/*</span>*/}
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
