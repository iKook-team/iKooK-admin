import { ReactNode, useMemo } from 'react';
import CalendarIcon from '../../../app/components/CalendarIcon.tsx';

interface PaymentHeaderProps {
  children?: ReactNode;
}

export default function PaymentsHeader({ children }: PaymentHeaderProps) {
  const header = useMemo(() => ['User', 'Date', 'Amount', 'Gateway'], []);

  return (
    <tr>
      {header.map((title) => (
        <th key={title} className="text-left">
          {title === 'Date' ? (
            <>
              <CalendarIcon /> Date
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
