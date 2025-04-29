import { AddonClient, AddonClientStatus, AddonService, AddonServiceStatus } from '../data/model.ts';
import UsernameAndImage from '../../users/components/UsernameAndImage.tsx';
import ItemStatus from '../../../app/components/ItemStatus.tsx';
import { capitalize } from '../../../utils/strings.ts';
import { Merge } from '../../../utils/type.ts';
import { formatCurrency } from '../../../utils/helper.ts';

type AddonRowProps = Merge<AddonClient, AddonService> & {
  onClick?: () => void;
  status: AddonClientStatus & AddonServiceStatus;
};

export default function AddonRow(props: AddonRowProps) {
  const isActive =
    props.status === AddonClientStatus.verified || props.status === AddonServiceStatus.active;
  return (
    <tr onClick={props.onClick}>
      <td>
        {props.client ? (
          props.client
        ) : (
          <UsernameAndImage name={`${props.first_name} ${props.last_name}`} image={props.avatar} />
        )}
      </td>
      <td>{props.name ? props.name : props.business_name}</td>
      <td>{props.price ? formatCurrency(props.price) : props.address}</td>
      {props.phone_number && <td>{props.phone_number}</td>}
      <td>
        <ItemStatus
          title={capitalize(props.status)}
          circleColor={isActive ? 'bg-green' : 'bg-red-base'}
          textColor={isActive ? 'text-green' : 'text-red-base'}
        />
      </td>
    </tr>
  );
}
