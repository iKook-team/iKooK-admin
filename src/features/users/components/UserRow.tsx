import UsernameAndImage from '../../users/components/UsernameAndImage.tsx';
import { ReactNode } from 'react';
import { UserType } from '../domain/types.ts';
import { User } from '../data/model.ts';
import ItemStatus from '../../../app/components/ItemStatus.tsx';

interface UserRowProps extends User {
  leading?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  isServices?: boolean;
  type: UserType;
}

export default function UserRow(props: UserRowProps) {
  const verified =
    props.type === UserType.chef
      ? props.identity_verified && props.document_verified
      : props.identity_verified;
  return (
    <tr className={props.isSelected ? 'active' : undefined} onClick={props.onClick}>
      {props.leading}
      <td>
        <UsernameAndImage
          name={`${props.first_name} ${props.last_name}`}
          image={props.avatar}
          status={props.isServices || props.type === UserType.admin ? undefined : props.is_active}
          statusText={props.status}
        />
      </td>
      <td>{props.email}</td>
      {props.type !== UserType.admin && <td>{props.address || props.city || props.country}</td>}
      {props.type !== UserType.chef ? (
        <td>{props.phone_number}</td>
      ) : (
        <>
          {!props.isServices && <td>{props.balance}</td>}
          <td>{props.average_rating?.toFixed(2)}</td>
        </>
      )}
      {props.type === UserType.admin && <td className="capitalize">{props.user_type}</td>}
      <td>
        {props.type === UserType.admin ? (
          <ItemStatus
            title={props.status}
            circleColor={props.is_active ? 'bg-green' : 'bg-red-base'}
            textColor={props.is_active ? 'text-green' : 'text-red-base'}
          />
        ) : (
          <ItemStatus
            title={verified ? 'Verified' : 'Not verified'}
            circleColor={verified ? 'bg-green' : 'bg-red-base'}
            textColor={verified ? 'text-green' : 'text-red-base'}
          />
        )}
      </td>
      {props.children}
    </tr>
  );
}
