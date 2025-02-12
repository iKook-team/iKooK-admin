import IdCell from '../../../app/components/IdCell.tsx';
import UsernameAndImage from '../../users/components/UsernameAndImage.tsx';
import { BookingType } from '../domain/types.ts';
import { formatCurrency } from '../../../utils/helper.ts';
import ItemStatus from '../../../app/components/ItemStatus.tsx';
import { capitalize } from '../../../utils/strings.ts';
import { Bookings } from '../data/model.ts';
import { ReactNode } from 'react';
import ImageStack from '../../../app/components/ImageStack.tsx';
import Constants from '../../../utils/constants.ts';

interface BookingRowProps extends Bookings {
  type: BookingType;
  onClick?: () => void;
  children?: ReactNode;
}

export default function BookingRow(props: BookingRowProps) {
  const proposalList = props?.proposals;
  return (
    <tr onClick={props.onClick}>
      <td>
        <IdCell id={props.id} />
      </td>
      <td>
        <UsernameAndImage
          name={`${props.user.firstName} ${props.user.lastName}`}
          image={props.user?.photo ? props?.user?.photo : ''}
        />
      </td>
      <td className="capitalize">
        {props.type === BookingType.enquiries
          ? props.country
          : props.chef?.photo
            ? `chef ${props.chef?.firstName}`
            : ''}
      </td>

      <td>
        {props.type === BookingType.enquiries ? (
          <ImageStack
            images={
              proposalList
                .map((item) => Constants.getAssetUrl(item.photo, 'users'))
                .filter(Boolean) as string[]
            }
            includeRing={proposalList.length > 1}
            maxImages={2}
            size={24}
            moreClassName="bg-gray-200"
          />
        ) : (
          props.menu
        )}
      </td>

      <td>
        {props.type === BookingType.enquiries
          ? props.number_of_guest
          : formatCurrency(props.amount, props.currency)}
      </td>

      {props.type === BookingType.menus && (
        <td>
          <ItemStatus
            title={capitalize(props.status)}
            circleColor={
              props.status === 'completed'
                ? 'bg-green'
                : props.status === 'pending'
                  ? 'bg-primary'
                  : props.status === 'cancelled'
                    ? 'bg-red-base'
                    : props.status === 'enquiry'
                      ? 'bg-secondary'
                      : 'bg-jordy-blue'
            }
            textColor={
              props.status === 'completed'
                ? 'text-green'
                : props.status === 'pending'
                  ? 'text-primary'
                  : props.status === 'cancelled'
                    ? 'text-red'
                    : props.status === 'enquiry'
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
