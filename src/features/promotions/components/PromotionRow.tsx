import IdCell from '../../../app/components/IdCell.tsx';
import UsernameAndImage from '../../users/components/UsernameAndImage.tsx';
import { formatCurrency, getDateWithOrdinal } from '../../../utils/formatter.ts';
import ItemStatus from '../../../app/components/ItemStatus.tsx';
import { ReactNode } from 'react';
import { GiftCard } from '../domain/types.ts';
import EmptyCell from '../../../app/components/EmptyCell.tsx';
import CalendarIcon from '../../../app/components/CalendarIcon.tsx';

interface PromotionRowProps extends GiftCard {
  children?: ReactNode;
  onClick?: () => void;
  isPurchase?: boolean;
}

export default function PromotionRow(props: PromotionRowProps) {
  const user = props.isPurchase ? props.purchased_by : props?.created_by;
  const active = props.isPurchase ? props.redeemed : props.is_active;
  return (
    <tr onClick={props.onClick}>
      <td>
        <IdCell id={props.id} />
      </td>
      <td>{props.isPurchase ? props.card_number : props.promo_code}</td>
      <td>
        {user ? (
          <UsernameAndImage name={`${user?.first_name} ${user?.last_name}`} image={user?.photo} />
        ) : (
          <EmptyCell />
        )}
      </td>
      <td>
        <CalendarIcon />
        {props.isPurchase
          ? getDateWithOrdinal(props.created_at, true)
          : `${getDateWithOrdinal(props.duration_to)} - ${getDateWithOrdinal(props.duration_from)}`}
      </td>
      <td>{props.isPurchase ? formatCurrency(props.amount, props.currency) : props.percentage}</td>
      <td>
        <ItemStatus
          title={
            active
              ? props.isPurchase
                ? 'Redeemed'
                : 'Active'
              : props.isPurchase
                ? 'Unused'
                : 'Expired'
          }
          circleColor={active ? 'bg-green' : 'bg-red-base'}
          textColor={active ? 'text-green' : 'text-red-base'}
        />
      </td>
      {props.children}
    </tr>
  );
}
