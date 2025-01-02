import Constants from '../../../utils/constants.ts';
import StatusPill from './StatusPill.tsx';

export default function UsernameAndImage(props: {
  name: string;
  image: string;
  isActive?: boolean;
}) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <img
        src={Constants.getImageUrl(props.image, 'users', props.name)}
        alt={props.name}
        className="w-6 aspect-square rounded-full"
      />
      <span className="capitalize">{props.name}</span>
      {props.isActive !== undefined && (
        <StatusPill
          status={props.isActive ? 'Active' : 'Suspended'}
          type={props.isActive ? 'active' : 'inactive'}
        />
      )}
    </div>
  );
}
