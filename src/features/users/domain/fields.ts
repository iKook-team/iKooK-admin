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
    placeholder: 'BullockUsername',
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
      placeholder: 'London',
      type: 'text',
      readonly: true
    },
    {
      id: 'address',
      placeholder: '123, Baker Street',
      type: 'text'
    },
    {
      id: 'postcode',
      label: 'Postal Code',
      placeholder: 'W1U 6TY',
      type: 'text'
    },
    {
      id: 'bio',
      placeholder: 'Tell us about yourself',
      type: 'text'
    }
  ].map((field) => ({ ...field, label: field.label || fromSnakeOrCamelCase(field.id) }))
);
