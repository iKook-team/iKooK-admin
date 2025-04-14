import IdCell from '../../../app/components/IdCell.tsx';
import UsernameAndImage from '../../users/components/UsernameAndImage.tsx';
import { BookingType } from '../domain/types.ts';
import { formatCurrency } from '../../../utils/helper.ts';
import ItemStatus from '../../../app/components/ItemStatus.tsx';
import { capitalize } from '../../../utils/strings.ts';
import { Booking, BookingStatus } from '../data/model.ts';
import { ReactNode } from 'react';

interface BookingRowProps extends Booking {
  type: BookingType;
  onClick?: () => void;
  children?: ReactNode;
}

export default function BookingRow(props: BookingRowProps) {
  return (
    <tr onClick={props.onClick}>
      <td>
        <IdCell id={props.id} />
      </td>
      <td>
        <UsernameAndImage name={props.host_name} image={props.host_avatar} />
      </td>
      <td className="capitalize">
        {props.type === BookingType.enquiries ? props.country : `Chef ${props.chef_name}`}
      </td>

      <td>{props.type === BookingType.enquiries ? props.chef_name : props.chef_service}</td>

      <td>
        {props.type === BookingType.enquiries
          ? (props.num_of_persons ?? props.num_of_guests)
          : formatCurrency(props.total_cost, props.currency)}
      </td>

      {props.type === BookingType.menus && (
        <td>
          <ItemStatus
            title={capitalize(props.status)}
            circleColor={
              props.status === BookingStatus.completed
                ? 'bg-green'
                : props.status === BookingStatus.pending
                  ? 'bg-primary'
                  : props.status === BookingStatus.cancelled
                    ? 'bg-red-base'
                    : props.status === BookingStatus.enquiries
                      ? 'bg-secondary'
                      : 'bg-jordy-blue'
            }
            textColor={
              props.status === BookingStatus.completed
                ? 'text-green'
                : props.status === BookingStatus.pending
                  ? 'text-primary'
                  : props.status === BookingStatus.cancelled
                    ? 'text-red-base'
                    : props.status === BookingStatus.enquiries
                      ? 'text-secondary'
                      : 'text-jordy-blue'
            }
          />
        </td>
      )}
      {props.children}
    </tr>
  );
}
