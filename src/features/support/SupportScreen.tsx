import { SupportTickets } from './SupportTickets.tsx';
import { SupportChat } from './SupportChat.tsx';

export default function SupportScreen() {
  return (
    <div className="grid grid-cols-[4fr_6fr] xl:grid-cols-[3fr_4fr_3fr] gap-4">
      <SupportTickets />
      <SupportChat />
    </div>
  );
}
