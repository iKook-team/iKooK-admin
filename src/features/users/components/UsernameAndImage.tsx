import Constants from '../../../utils/constants.ts';
import StatusPill, { StatusPillType } from './StatusPill.tsx';

export default function UsernameAndImage(props: {
  name: string;
  image?: string;
  status?: boolean;
  statusText?: string;
  'name-class-name'?: string;
}) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <img
        src={Constants.getImageUrl(props.image, 'users', props.name)}
        alt={props.name}
        className="w-6 aspect-square rounded-full"
      />
      <span className={`capitalize ${props['name-class-name'] ? props['name-class-name'] : ''}`}>
        {props.name}
      </span>
      {props.status !== undefined && (
        <StatusPill
          status={props.statusText ?? (props.status ? 'Active' : 'Suspended')}
          type={(props.statusText as StatusPillType) ?? (props.status ? 'active' : 'inactive')}
        />
      )}
    </div>
  );
}
