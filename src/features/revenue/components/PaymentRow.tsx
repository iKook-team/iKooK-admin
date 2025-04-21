import UsernameAndImage from '../../users/components/UsernameAndImage.tsx';
import { formatCurrency, getDateWithOrdinal } from '../../../utils/helper.ts';
import { capitalize } from '../../../utils/strings.ts';
import { ReactNode } from 'react';
import { Payment } from '../domain/model.ts';
import CalendarIcon from '../../../app/components/CalendarIcon.tsx';

interface PaymentRowProps extends Payment {
  children?: ReactNode;
}

export default function PaymentRow(props: PaymentRowProps) {
  const { user } = props;
  return (
    <tr>
      <td>
        {user ? (
          <UsernameAndImage name={`${user.first_name} ${user.last_name}`} image={user.avatar} />
        ) : (
          '-'
        )}
      </td>
      <td>
        <CalendarIcon />
        {getDateWithOrdinal(props.created_at, true)}
      </td>
      <td>{formatCurrency(Number(props.amount), props.currency)}</td>
      <td>{capitalize(props.gateway, true)}</td>
      {props.children}
    </tr>
  );
}
