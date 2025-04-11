import { Menu, MenuStatus } from '../data/model.ts';
import IdCell from '../../../app/components/IdCell.tsx';
import UsernameAndImage from '../../users/components/UsernameAndImage.tsx';
import { formatCurrency } from '../../../utils/helper.ts';
import ItemStatus from '../../../app/components/ItemStatus.tsx';
import { capitalize } from '../../../utils/strings.ts';
import { ReactNode } from 'react';

interface MenuRowProps extends Menu {
  children?: ReactNode;
  onClick?: () => void;
}

export default function MenuRow(props: MenuRowProps) {
  return (
    <tr onClick={props.onClick}>
      <td>
        <IdCell id={props.id} />
      </td>
      <td className="capitalize">{props.name}</td>
      <td>
        <UsernameAndImage
          name={`${props.chef?.first_name} ${props.chef?.last_name}`}
          image={props.chef?.avatar}
        />
      </td>
      <td></td>
      <td>{formatCurrency(Number(props.price_per_person), props.currency)}</td>
      <td>
        <ItemStatus
          title={capitalize(props.status)}
          circleColor={
            props.status === MenuStatus.active
              ? 'bg-green'
              : props.status === MenuStatus.deleted || props.status === MenuStatus.pending
                ? 'bg-red-base'
                : 'bg-jordy-blue'
          }
          textColor={
            props.status === MenuStatus.active
              ? 'text-green'
              : props.status === MenuStatus.deleted || props.status === MenuStatus.pending
                ? 'text-red-base'
                : 'text-jordy-blue'
          }
        />
      </td>
      {props.children}
    </tr>
  );
}
