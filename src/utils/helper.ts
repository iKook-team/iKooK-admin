import { DateTime } from 'luxon';

export const CURRENCIES = ['NGN', 'GBP', 'CAD', 'RAND'];

export function formatCurrency(
  amount: number,
  currency: string = 'NGN',
  maximumFractionDigits: number = 2
) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency === 'RAND' ? 'ZAR' : currency,
    maximumFractionDigits
  }).format(amount);
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat('en-NG').format(number);
}

function getOrdinalSuffix(day: number) {
  const j = day % 10;
  const k = day % 100;

  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

export function getDateWithOrdinal(date: string | undefined, includeYear: boolean = false) {
  const dateTime = DateTime.fromISO(date ?? new Date().toISOString());
  const day = `${dateTime.day}${getOrdinalSuffix(dateTime.day)}`;

  if (includeYear) {
    return dateTime.toFormat(`'${day}' MMMM, yyyy`);
  } else {
    return dateTime.toFormat(`'${day}' MMM`);
  }
}

export function getWeekNumber(date: Date) {
  const firstThursday = new Date(date.getFullYear(), 0, 4); // First Thursday of the year
  const firstThursdayTime = firstThursday.getTime();

  const currentTime = date.getTime();
  const diff = currentTime - firstThursdayTime;

  const oneWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
  return Math.ceil(diff / oneWeek + 1);
}

export function getDateFrom(day: number, week: number, year: number) {
  return DateTime.fromObject({
    weekYear: year,
    weekNumber: week,
    weekday: 1 // Start of week
  }).set({ day: day });
}

export function chunkList<T>(list: T[], size: number) {
  if (list.length === 0) {
    return [];
  }

  const result = [];
  for (let i = 0; i < list.length; i += size) {
    result.push(list.slice(i, i + size));
  }
  return result;
}

export function convertTo12Hour(hour: number) {
  let hour12 = hour % 12;
  const period = hour >= 12 ? 'PM' : 'AM';

  if (hour12 === 0) {
    hour12 = 12;
  }

  return `${hour12} ${period}`;
}

export function hoursInDate(hours: number[], date: string) {
  const dateTime = DateTime.fromISO(date);
  return hours.filter((hour) => hour === dateTime.hour).length > 0;
}
