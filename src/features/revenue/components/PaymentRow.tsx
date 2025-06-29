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
  const { host } = props;
  return (
    <tr>
      <td>
        {host ? (
          <UsernameAndImage name={`${host.first_name} ${host.last_name}`} image={host.avatar} />
        ) : (
          '-'
        )}
      </td>
      <td>
        <CalendarIcon />
        {getDateWithOrdinal(props.created_at, true)}
      </td>
      <td>{formatCurrency(Number(props.amount))}</td>
      <td>{capitalize(props.gateway, true)}</td>
      {props.children}
    </tr>
  );
}
