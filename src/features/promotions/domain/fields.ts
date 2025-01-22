import Field from '../../../app/domain/field.ts';
import { CURRENCIES } from '../../../utils/formatter.ts';

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
    type: 'number',
    min: 1,
    max: 100
  },
  {
    id: 'promo_code',
    placeholder: 'Custom Code',
    type: 'text',
    maxLength: 15
  },
  {
    id: 'currency',
    placeholder: 'Currency',
    type: 'select',
    options: CURRENCIES
  },
  {
    id: 'number_of_users',
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
