import { SupportTickets } from './SupportTickets.tsx';
import { SupportChat } from './SupportChat.tsx';
import { SupportInfo } from './SupportInfo.tsx';
import useBreakpoint from '../../hooks/useBreakpoint.ts';
import { useQueryState } from 'nuqs';
import { useLocation, useNavigate } from 'react-router-dom';
import PageBackButton from '../../app/components/page/PageBackButton.tsx';

export default function SupportScreen() {
  const isXl = useBreakpoint('xl').isAboveXl;
  const isLg = useBreakpoint('lg').isAboveLg;
  const navigate = useNavigate();
  const location = useLocation();
  const [ticketId, _] = useQueryState('ticket_id', {
    defaultValue: ''
  });

  const setTicketId = (ticketId: string) => {
    const params = new URLSearchParams(location.search);
    params.set('ticket_id', ticketId);
    navigate({ search: params.toString() });
  };

  if (isXl) {
    return (
      <div className="grid grid-cols-[3fr_4fr_3fr] gap-4">
        <SupportTickets selected={ticketId} setSelected={setTicketId} />
        <SupportChat ticketId={ticketId} />
        <SupportInfo ticketId={ticketId} />
      </div>
    );
  }

  if (isLg) {
    return (
      <div className="grid grid-cols-[4fr_6fr] gap-4">
        <SupportTickets selected={ticketId} setSelected={setTicketId} />
        <div className="flex flex-col gap-5">
          <SupportChat ticketId={ticketId} />
          <div className="px-5 border-x border-x-black-neutral-4">
            <SupportInfo ticketId={ticketId} />
          </div>
        </div>
      </div>
    );
  }

  if (ticketId) {
    return (
      <>
        <PageBackButton />
        <div className="flex flex-col gap-5">
          <SupportChat ticketId={ticketId} includeBorder={false} />
          <SupportInfo ticketId={ticketId} />
        </div>
      </>
    );
  }

  return <SupportTickets selected={ticketId} setSelected={setTicketId} />;
}
