import { ReactSVG } from 'react-svg';
import Icon from '../assets/icons/calendar.svg';

export default function CalendarIcon() {
  return (
    <ReactSVG src={Icon} wrapper="svg" className="text-black-base/40 w-3 h-3 inline-block mr-1" />
  );
}
