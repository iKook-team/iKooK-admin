import { IconType } from 'react-icons';

export default interface Field {
  id: string;
  icon?: IconType;
  label: string;
  placeholder: string;
  type: string;
}
