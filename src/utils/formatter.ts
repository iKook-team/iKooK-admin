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
