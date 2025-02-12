import { ReactSVG } from 'react-svg';
import arrowLeft from '../../../app/assets/icons/arrow-left.svg';
import arrowRight from '../../../app/assets/icons/arrow-right.svg';

type Direction = 'left' | 'right';

interface ControlArrowProps {
  direction: Direction;
  onClick: (direction: Direction) => void;
  className?: string;
}

export default function ControlArrow({ direction, onClick, className }: ControlArrowProps) {
  return (
    <button
      className={`rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center ${className ?? ''}`}
      onClick={() => onClick(direction)}
    >
      <ReactSVG src={direction === 'left' ? arrowLeft : arrowRight} wrapper="span" />
    </button>
  );
}
