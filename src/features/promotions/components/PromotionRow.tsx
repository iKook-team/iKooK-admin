import IdCell from '../../../app/components/IdCell.tsx';
import UsernameAndImage from '../../users/components/UsernameAndImage.tsx';
import { formatCurrency } from '../../../utils/formatter.ts';
import VerificationStatus from '../../../app/components/VerificationStatus.tsx';
import { ReactNode } from 'react';
import { GiftCard } from '../domain/types.ts';
import EmptyCell from '../../../app/components/EmptyCell.tsx';
import { DateTime } from 'luxon';
import CalendarIcon from '../../../app/assets/icons/calendar.svg';
import { ReactSVG } from 'react-svg';

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
        <ReactSVG
          src={CalendarIcon}
          wrapper="svg"
          className="text-black-base/40 w-3 h-3 inline-block mr-1"
        />
        {props.isPurchase
          ? getDate(props.created_at, true)
          : `${getDate(props.duration_to)} - ${getDate(props.duration_from)}`}
      </td>
      <td>{props.isPurchase ? formatCurrency(props.amount, props.currency) : props.percentage}</td>
      <td>
        <VerificationStatus
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

function getDate(date: string | undefined, isPurchase: boolean = false) {
  const dateTime = DateTime.fromISO(date ?? new Date().toISOString());

  if (isPurchase) {
    return dateTime.toFormat(`${dateTime.day} MMMM, yyyy`);
  } else {
    return dateTime.toFormat(`${dateTime.day} MMM`);
  }
}
