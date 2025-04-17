import { SupportTicket } from '../domain/types.ts';
import UsernameAndImage from '../../users/components/UsernameAndImage.tsx';

interface SupportTicketItemProps extends SupportTicket {
  isActive?: boolean;
  onClick?: () => void;
}

export default function SupportTicketItem(props: SupportTicketItemProps) {
  const animation = 'transition-all duration-500 ease-in-out';
  const actionClass = 'capitalize px-2 py-1 bg-white border rounded text-xs ' + animation;
  return (
    <div
      className={`${animation} flex flex-col gap-2 p-2 rounded-lg border ${props.isActive ? 'border-blue-400 bg-primal-0' : 'border-black-neutral-3'}`}
      onClick={props.onClick}
    >
      <div className="flex flex-row justify-between items-center">
        <UsernameAndImage
          name={`${props.user.first_name} ${props.user.last_name}`}
          image={props.user.avatar}
          name-class-name="text-sm font-bold text-black-base"
        />
        <p className="text-xs text-gray-granite">{props.created_at}</p>
      </div>
      <h3 className="text-xs text-gray-granite">{props.title}</h3>
      <div className="flex flex-row gap-4 items-center">
        <span
          className={`${actionClass} text-primal-base ${props.isActive ? 'border-primal-300' : 'border-primal-0 bg-primal-0'}`}
        >
          {props.status}
        </span>
        <span className={`${actionClass} text-red-base border-red-base`}>High Priority</span>
        <span className={`${actionClass} text-orange-base border-caramel`}>{props.category}</span>
      </div>
    </div>
  );
}
