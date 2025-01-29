import UsernameAndImage from '../../users/components/UsernameAndImage.tsx';
import ItemStatus from '../../../app/components/ItemStatus.tsx';
import { ReactNode } from 'react';
import { UserType } from '../domain/types.ts';
import { User } from '../data/model.ts';

interface UserRowProps extends User {
  leading?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  type: UserType;
}

export default function UserRow(props: UserRowProps) {
  return (
    <tr className={props.isSelected ? 'active' : undefined} onClick={props.onClick}>
      {props.leading}
      <td>
        <UsernameAndImage
          name={`${props.first_name} ${props.last_name}`}
          image={props.photo}
          status={props.is_active}
          statusText={props.status}
        />
      </td>
      <td>{props.email}</td>
      <td>{props.address}</td>
      {props.type === UserType.host ? (
        <td>{props.mobile}</td>
      ) : (
        <>
          <td>Wallet</td>
          <td>{props.rating}</td>
        </>
      )}
      <td>
        <ItemStatus
          title={props.verified ? 'Verified' : 'Not verified'}
          circleColor={props.verified ? 'bg-green' : 'bg-red-base'}
          textColor={props.verified ? 'text-green' : 'text-red-base'}
        />
      </td>
      {props.children}
    </tr>
  );
}
