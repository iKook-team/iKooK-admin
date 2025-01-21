import Field from '../../../app/domain/field.ts';
import { CURRENCIES } from '../../../utils/formatter.ts';

export const createGiftFields: Field[] = [
  {
    id: 'currency',
    label: 'Currency',
    placeholder: 'Select currency',
    type: 'select'
  },
  {
    id: 'amount',
    label: 'Amount',
    placeholder: 'Enter amount',
    type: 'number'
  }
];

export const createPromoFields: Field[] = [
  {
    id: 'title',
    placeholder: 'Promo title',
    type: 'text'
  },
  {
    id: 'description',
    placeholder: 'Promo description',
    type: 'text'
  },
  {
    id: 'percentage',
    placeholder: 'Discount percentage (%)',
    type: 'number'
  },
  {
    id: 'coupon_code',
    placeholder: 'Custom Code',
    type: 'text'
  },
  {
    id: 'currency',
    placeholder: 'Currency',
    type: 'select',
    options: CURRENCIES
  },
  {
    id: 'no_of_users',
    placeholder: 'Number of users',
    type: 'number'
  },
  {
    id: 'has_duration',
    label: 'Set Duration',
    type: 'toggle'
  },
  {
    id: 'has_menu',
    label: 'For a menu',
    type: 'toggle'
  }
];

export const createPromoDurationFields: Record<string, Field[]> = {
  from: [
    {
      id: 'from_date',
      placeholder: 'Date',
      type: 'date'
    },
    {
      id: 'from_time',
      placeholder: 'Time',
      type: 'time'
    }
  ],
  to: [
    {
      id: 'to_date',
      placeholder: 'Date',
      type: 'date'
    },
    {
      id: 'to_time',
      placeholder: 'Time',
      type: 'time'
    }
  ]
};

export const createPromoMenuFields: Field[] = [
  {
    id: 'menu',
    placeholder: 'Select Menu',
    type: 'text'
  }
];
