import Field from '../../../app/domain/field.ts';
import { fromSnakeOrCamelCase } from '../../../utils/strings.ts';

export const hostProfileFields: Field[] = [
  {
    id: 'first_name',
    placeholder: 'Sandra',
    type: 'text'
  },
  {
    id: 'last_name',
    placeholder: 'Bullock',
    type: 'text'
  },
  {
    id: 'user_name',
    placeholder: 'sandy',
    type: 'text'
  },
  {
    id: 'email',
    label: 'Email Address',
    placeholder: 'sandrabullock@ikook.co.uk',
    type: 'email'
  },
  {
    id: 'mobile',
    label: 'Phone Number',
    placeholder: '+234 810 166 7299',
    type: 'phone'
  }
].map((field) => ({ ...field, label: field.label || fromSnakeOrCamelCase(field.id) }));

export const chefProfileFields: Field[] = hostProfileFields.concat(
  [
    {
      id: 'date_of_birth',
      placeholder: '17/01/1990',
      type: 'date'
    },
    {
      id: 'country',
      label : 'Country of residence',
      placeholder: 'United Kingdom',
      type: 'text',
      readonly: true
    },
    {
      id: 'state',
      placeholder: 'London',
      type: 'text',
      readonly: true
    },
    {
      id: 'city',
      label : 'city/state',
      placeholder: 'London',
      type: 'text',
      readonly: true
    },
    {
      id: 'address',
      label : 'Your address',
      placeholder: 'Enter address',
      type: 'text'
    },
    {
      id: 'postcode',
      label: 'Postal Code',
      placeholder: 'Enter post code',
      type: 'text'
    },
    {
      id: 'brief_profile',
      placeholder: 'Let us know few things about your experience',
      type: 'text'
    }
  ].map((field) => ({ ...field, label: field.label || fromSnakeOrCamelCase(field.id) }))
);

export const chefAccountFields: Field[] = [
  {
    id: 'billing_address',
    label : 'Billing Address',
    placeholder: 'Enter address',
    type: 'text'
  },
  {
    id: 'city',
    label : 'City',
    placeholder: 'Enter city',
    type: 'text',
    readonly: true
  },
  {
    id: 'postcode',
    label : 'Post Code',
    placeholder: 'Enter postcode',
    type: 'text'
  },
  {
    id: 'bank',
    placeholder: 'Select Bank',
    type: 'select',
    readonly: true
  },
  {
    id: 'account_number',
    label : 'Account Number',
    placeholder: 'Enter Account number',
    type: 'text'
  },
  {
    id: 'iban_code',
    label: 'IBAN Code',
    placeholder: 'Enter Account Number or IBAN',
    type: 'text'
  },
  {
    id: 'sort_code',
    label: 'Sort code or SWIFT/BIC code',
    placeholder: 'Enter Sort code or SWIFT/BIC code',
    type: 'text'
  }
].map((field) => ({ ...field, label: field.label || fromSnakeOrCamelCase(field.id) }));

export const chefServiceFields: Field[] = [
  {
    id: 'starting_price',
    label: 'starting price',
    placeholder: '£50',
    type: 'text'
  },
  {
    id: 'minimum_number_of_guests',
    placeholder: '5',
    type: 'text'
  }
].map((field) => ({ ...field, label: field.label || fromSnakeOrCamelCase(field.id) }));

export const chefSettingsFields: Field[] = [
  {
    id: 'current_password',
    label: 'current password',
    placeholder: 'Enter Password',
    type: 'text'
  },
  {
    id: 'new_password',
    label: 'new password',
    placeholder: 'Enter Password',
    type: 'text'
  }
].map((field) => ({ ...field, label: field.label || fromSnakeOrCamelCase(field.id) }));

export const customizedEmailField: Field[] = [
  {
    id: 'email',
    label: 'All the emails will be sent to the below email address',
    placeholder: 'sandrabullock@ikook.co.uk',
    type: 'email'
  }
].map((field) => ({ ...field, label: field.label || fromSnakeOrCamelCase(field.id) }));


export const chefPasswordField : Field[] = [
  {
    id: 'new_password',
    label : 'New Password',
    placeholder: '****',
    type: 'password'
  }
].map((field) => ({ ...field, label: field.label || fromSnakeOrCamelCase(field.id) }));


export const chefAccountInitials = {
  billing_address: '',
  city: '',
  postcode: '',
  bank: '',
  account_number: '',
  iban_code : '',
  sort_code: ''
};

export const chefServicesInitials = {
  starting_price : '',
  minimum_number_of_guests : '',
}

export const chefSettingsInitials = {
  starting_price : '',
  minNoGuest : ''
}

export const userPasswordInitiails = {
  new_password : ''
}