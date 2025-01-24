import { ReactNode, useMemo } from 'react';
import CalendarIcon from '../../../app/assets/icons/calendar.svg';
import { ReactSVG } from 'react-svg';

interface PromotionsHeaderProps {
  children?: ReactNode;
  isPurchase: boolean;
}

export default function PromotionsHeader({ children, isPurchase }: PromotionsHeaderProps) {
  const header = useMemo(
    () => [
      'ID',
      isPurchase ? 'Card Number' : 'Promo Code',
      isPurchase ? 'Purchased by' : 'Created by',
      'Date',
      isPurchase ? 'Amount' : '% Off',
      'Status'
    ],
    [isPurchase]
  );

  return (
    <tr>
      {header.map((title) => (
        <th key={title} className="text-left">
          {title === 'Date' ? (
            <>
              <ReactSVG
                src={CalendarIcon}
                wrapper="svg"
                className="text-black-base/40 w-3 h-3 inline-block mr-1"
              />{' '}
              Date
            </>
          ) : (
            title
          )}
        </th>
      ))}
      {children}
    </tr>
  );
}
