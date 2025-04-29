import Field from '../../../app/domain/field.ts';
import { AddonClientStatus, AddonServiceStatus } from '../data/model.ts';

export const createAddonClientFields: Field[] = [
  {
    id: 'first_name',
    label: 'First Name',
    type: 'text',

    placeholder: 'Give name'
  },
  {
    id: 'last_name',
    label: 'Last Name',
    type: 'text',

    placeholder: 'Family Name'
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',

    placeholder: 'info@ikook.co.uk'
  },
  {
    id: 'phone_number',
    label: 'Phone Number',
    type: 'phone',

    placeholder: '+234 810 166 7299'
  },
  { id: 'country', label: 'Country', type: 'select', placeholder: 'Enter country' },
  { id: 'city', label: 'City', type: 'select', placeholder: 'Enter city' },
  { id: 'address', label: 'Address', type: 'text', placeholder: 'Enter address' },
  {
    id: 'postal_code',
    label: 'Postal Code',
    type: 'text',
    placeholder: 'Enter post code'
  },
  {
    id: 'business_name',
    label: 'Business Name',
    type: 'text',
    placeholder: 'Enter business name'
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: Object.values(AddonClientStatus),
    placeholder: 'Select status'
  }
];

export const createAddonServiceFields = [
  {
    id: 'name',
    label: 'Product',
    type: 'text',
    required: true,
    placeholder: 'Pack of Chilled Drinks'
  },
  { id: 'price', label: 'Price', type: 'number', required: true, placeholder: 'Enter price' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: Object.values(AddonServiceStatus),
    required: true,
    placeholder: 'Select status'
  },
  {
    id: 'client',
    label: 'Client ID',
    type: 'number',
    required: true,
    placeholder: 'Enter client ID'
  }
];
