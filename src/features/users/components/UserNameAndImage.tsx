import Constants from '../../../utils/constants.ts';

export default function UserNameAndImage(props: {
  name: string;
  image: string;
  isActive?: boolean;
}) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <img
        src={`${Constants.userUrl}/${props.image}`}
        alt={props.name}
        className="w-6 aspect-square rounded-full"
      />
      <span className="capitalize">{props.name}</span>
      {props.isActive !== undefined && (
        <span
          className={`px-3 py-1 rounded-full ${props.isActive ? 'bg-green/10 text-green' : 'bg-red/10 text-red'}`}
        >
          {props.isActive ? 'Active' : 'Suspended'}
        </span>
      )}
    </div>
  );
}
