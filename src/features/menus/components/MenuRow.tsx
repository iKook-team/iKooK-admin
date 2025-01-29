import { Menu } from '../data/model.ts';
import IdCell from '../../../app/components/IdCell.tsx';
import UsernameAndImage from '../../users/components/UsernameAndImage.tsx';
import { formatCurrency } from '../../../utils/formatter.ts';
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
      <td className="capitalize">{props.menuName}</td>
      <td>
        <UsernameAndImage
          name={`${props.chefID.first_name} ${props.chefID.last_name}`}
          image={props.chefID.photo}
        />
      </td>
      <td></td>
      <td>{formatCurrency(Number(props.menuPrice), props.currency)}</td>
      <td>
        <ItemStatus
          title={capitalize(props.status)}
          circleColor={
            props.status === 'approved'
              ? 'bg-green'
              : props.status === 'deleted' || props.status === 'unapproved'
                ? 'bg-red-base'
                : 'bg-jordy-blue'
          }
          textColor={
            props.status === 'approved'
              ? 'text-green'
              : props.status === 'deleted' || props.status === 'unapproved'
                ? 'text-red-base'
                : 'text-jordy-blue'
          }
        />
      </td>
      {props.children}
    </tr>
  );
}
