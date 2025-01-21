export const CURRENCIES = ['NGN', 'GBP', 'CAD', 'RAND'];

export function formatCurrency(amount: number, currency: string = 'NGN') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}
