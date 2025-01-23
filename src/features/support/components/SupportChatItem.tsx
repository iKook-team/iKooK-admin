import UsernameAndImage from '../../users/components/UsernameAndImage.tsx';
import { DateTime } from 'luxon';
import LinkPreview from '../../../app/components/LinkPreview.tsx';

interface SupportChatItemProps {
  user: {
    first_name: string;
    last_name: string;
    photo: string;
  } | null;
  date: string;
  content: string;
}

export default function SupportChatItem(props: SupportChatItemProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <UsernameAndImage
          name={props.user ? `${props.user?.first_name} ${props.user?.last_name}` : 'iKooK Support'}
          image={props.user?.photo}
          name-class-name="text-sm text-gray-granite"
        />
        <p className="text-xs text-gray-granite">
          {DateTime.fromISO(props.date).toFormat('MMMM dd, hh:mm')}
        </p>
      </div>
      <p className={`text-xs text-gray-granite ${props.user ? 'mt-2' : 'mt-3'}`}>{props.content}</p>
      <LinkPreview text={props.content} className="mt-4" />
    </div>
  );
}
