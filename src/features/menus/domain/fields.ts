import Field from "../../../app/domain/field";
import { fromSnakeOrCamelCase } from "../../../utils/strings";

export const newMenuFields: Field[] = [
  {
    id: 'menu_name',
    label : "Menu name",
    placeholder: 'What is the menu name',
    type: 'text'
  },
  {
    id: 'price',
    label : 'price',
    placeholder: 'Price per person',
    type: 'text'
  },
  {
    id: 'min_guest_number',
    label : 'Minimum number of guests',
    placeholder: 'What is the minimum of guests',
    type: 'text'
  },
  {
    id: 'max_menu_selection',
    label: 'Maximum menu selection',
    placeholder: '3',
    type: 'email'
  },
  {
    id: 'event_type',
    label: 'event type',
    placeholder: '',
    type: 'phone'
  },
  {
    id: 'cusine_type',
    label: 'cusine type',
    placeholder: '',
    type: 'phone'
  },
  {
    id: 'menu_type',
    label: 'cusine type',
    placeholder: 'Chef at home',
    type: 'phone'
  }
].map((field) => ({ ...field, label: field.label || fromSnakeOrCamelCase(field.id) }));