import { useFetchCalendarQuery } from './domain/usecase.ts';
import PageTitle from '../../app/components/page/PageTitle.tsx';
import { DropdownField } from '../../app/components/InputField.tsx';
import ControlArrow from './components/ControlArrow.tsx';
import { LoadingSpinner } from '../../app/components/LoadingSpinner.tsx';
import CalendarDayHeader from './components/CalendarDayHeader.tsx';
import { Fragment, useMemo, useRef, useState } from 'react';
import { chunkList, convertTo12Hour } from '../../utils/helper.ts';
import CalendarEntryItem from './components/CalendarEntryItem.tsx';
import { CalendarEntry } from './domain/types.ts';
import CalendarDetailsModal from './components/CalendarDetailsModal.tsx';
import { DateTime } from 'luxon';

export default function CalendarScreen() {
  const { calendar, isPending, error, week, setWeek, year, setYear } = useFetchCalendarQuery();
  const [selected, setSelected] = useState<{ entry: CalendarEntry; hours: number[] }>();
  const detailsRef = useRef<HTMLDialogElement>(null);

  const startDate = useMemo(
    () =>
      DateTime.fromObject({
        weekYear: year,
        weekNumber: week
      }).startOf('week'),
    [year, week]
  );

  const hours = useMemo(
    () =>
      chunkList(
        Array.from({ length: 24 }, (_, i) => i),
        6
      ),
    []
  );

  const weeks = useMemo(() => Array.from({ length: 52 }, (_, i) => `${i + 1}`), []);

  const years = useMemo(
    () => Array.from({ length: 2 }, (_, i) => `${new Date().getFullYear() + i}`),
    []
  );

  const onDirection = (direction: 'left' | 'right') => {
    const newYear =
      direction === 'left' && week === 1
        ? year - 1
        : direction === 'right' && week === 52
          ? year + 1
          : year;

    let newWeek: number;
    if (newYear === year - 1) {
      newWeek = 52;
    } else if (newYear === year + 1) {
      newWeek = 1;
    } else {
      newWeek = direction === 'left' ? week - 1 : week + 1;
    }

    if (weeks.includes(newWeek.toString())) {
      void setWeek(newWeek);
    }
    if (years.includes(newYear.toString())) {
      void setYear(newYear);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <PageTitle title="Calendar" />
        <div className="flex items-center gap-4">
          <DropdownField
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
            options={weeks}
            get-label={(week) => `Week ${week}`}
            className="sm:min-w-40"
          />
          <DropdownField
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            options={years}
            className="sm:min-w-40"
          />
        </div>
      </div>
      {isPending ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="flex justify-center items-center h-96 text-red-500">{error.message}</div>
      ) : calendar ? (
        <div
          className="grid overflow-x-auto mt-6 border-y border-black-base/10"
          style={{
            gridTemplateColumns: `repeat(9, minmax(8.5rem, 1fr))`
          }}
        >
          <ControlArrow direction="left" onClick={onDirection} className="my-5 place-self-center" />
          {Array.from({ length: 7 }).map((_, i) => (
            <CalendarDayHeader
              key={i}
              date={startDate.plus({ days: i })}
              className="my-5 place-self-center"
            />
          ))}
          <ControlArrow
            direction="right"
            onClick={onDirection}
            className="my-5 place-self-center"
          />

          <div className="col-span-full h-[1px] bg-black-base/10 w-full" />

          {hours.map((group, hourIndex) => (
            <Fragment key={hourIndex}>
              {/** Hours */}
              <div className="dark-charcoal/70 text-xs font-medium place-self-center self-stretch flex flex-col justify-around">
                {group.map((hour) => (
                  <p key={hour}>{convertTo12Hour(hour)}</p>
                ))}
              </div>

              {/** Days */}
              {Array.from({ length: 7 }).map((_, i) => {
                const date = startDate.plus({ days: i });
                const formatted = date.toFormat('yyyy-MM-dd');
                const entry = calendar.find(
                  (entry) =>
                    (entry.start_date === formatted || entry.end_date === formatted) &&
                    group.find(
                      (hour) =>
                        hour >= DateTime.fromISO(entry.start_time).hour &&
                        hour <= DateTime.fromISO(entry.end_time).hour
                    ) !== undefined
                );
                return (
                  <div
                    key={formatted}
                    className={`${i === 0 ? 'border-l' : ''} ${hourIndex < hours.length - 1 ? 'border-b' : ''} border-r border-black-base/10 p-2`}
                  >
                    <CalendarEntryItem
                      entry={entry}
                      onClick={() => {
                        if (entry) {
                          setSelected({ entry, hours: group });
                          detailsRef.current?.showModal();
                        }
                      }}
                    />
                  </div>
                );
              })}
              {hourIndex < hours.length - 1 ? (
                <div className="border-b border-black-base/10" />
              ) : null}
            </Fragment>
          ))}
        </div>
      ) : null}
      <CalendarDetailsModal
        ref={detailsRef}
        data={selected?.entry}
        hours={selected?.hours}
        week={week}
        year={year}
      />
    </>
  );
}
