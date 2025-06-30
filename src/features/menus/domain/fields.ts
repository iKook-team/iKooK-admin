import Field from '../../../app/domain/field';
import { fromSnakeOrCamelCase } from '../../../utils/strings';
import { CuisineTypeEnum, EventTypeEnum } from './types.ts';
import { CourseTypeEnum } from './schema.ts';
import { ServiceType } from '../../users/domain/types.ts';

export const createMenuFields: Field[] = [
  {
    id: 'name',
    label: 'Menu name',
    placeholder: 'What is the menu name?',
    type: 'text'
  },
  {
    id: 'price_per_person',
    label: 'Price',
    placeholder: 'Price per person',
    type: 'number'
  },
  {
    id: 'num_of_guests',
    label: 'Minimum number of guests',
    placeholder: 'Minimum guests',
    type: 'number'
  },
  {
    id: 'max_menu_selection',
    label: 'Maximum menu selection',
    placeholder: '3',
    type: 'number'
  },
  {
    id: 'event_types',
    label: 'Event types',
    placeholder: 'Select Events',
    type: 'multiselect',
    options: EventTypeEnum.options
  },
  {
    id: 'cuisine_types',
    label: 'Cuisine types',
    placeholder: 'Select Cuisines',
    type: 'multiselect',
    options: CuisineTypeEnum.options
  },
  {
    id: 'menu_type',
    label: 'Menu type',
    placeholder: ServiceType.chefAtHome,
    options: [
      ServiceType.chefAtHome,
      ServiceType.fineDining,
      ServiceType.largeEvent,
      ServiceType.corporateDining,
      ServiceType.mealPrep,
      ServiceType.mealDelivery
    ],
    type: 'select'
  },
  {
    id: 'courses',
    label: 'Courses',
    placeholder: 'Select',
    type: 'multiselect',
    options: CourseTypeEnum.options
  },
  {
    id: 'chef_id',
    label: 'Chef',
    placeholder: 'Chef Ayo',
    type: 'text'
  }
].map((field) => ({ ...field, label: field.label || fromSnakeOrCamelCase(field.id) }));

export const createMenuEntryFields: Field[] = [
  {
    id: 'selection_limit',
    label: 'Course selection limit',
    placeholder: 'What is the course selection limit?',
    type: 'number'
  },
  {
    id: 'extra_charge_per_person',
    label: 'Extra charge per person',
    placeholder: 'What is the extra charge per person?',
    type: 'number'
  }
];

export const createMenuItemsFields: Field[] = [
  {
    id: 'name',
    label: 'Menu Item name',
    placeholder: 'What is the menu item name?',
    type: 'text'
  },
  {
    id: 'description',
    label: 'Menu Item description',
    placeholder: 'What is the menu item description?',
    type: 'text'
  }
];
