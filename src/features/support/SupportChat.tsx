import {
  useGetSupportTicket,
  useGetSupportTicketMessages,
  useReplyTicket
} from './domain/usecase.ts';
import SupportChatItem from './components/SupportChatItem.tsx';
import { Fragment, useState } from 'react';
import { LoadingSpinner } from '../../app/components/LoadingSpinner.tsx';
import { UserType } from '../users/domain/types.ts';

export function SupportChat({
  ticketId,
  includeBorder = true
}: {
  ticketId: number | null;
  includeBorder?: boolean;
}) {
  const ticket = useGetSupportTicket(ticketId);
  const { data: messages } = useGetSupportTicketMessages(ticketId);
  const reply = useReplyTicket(ticketId);
  const [message, setMessage] = useState('');

  return (
    <div className={`w-full ${includeBorder ? 'border-x border-x-black-neutral-4' : ''}`}>
      {ticket ? (
        <div>
          <h2 className="text-sm font-bold text-black-base p-5 pb-6 border-b border-b-black-neutral-4 mb-10">
            {ticket.title}
          </h2>
          <div className="px-3">
            {messages?.map((message, index) => (
              <Fragment key={index}>
                <SupportChatItem
                  user={message.sender?.user_type === UserType.admin ? null : ticket.user}
                  date={message.created_at}
                  content={message.message}
                />
                <div className="h-[1px] w-full mt-5 mb-6 bg-black-neutral-4" />
              </Fragment>
            ))}
            <textarea
              className="w-full h-32 p-4 rounded-md border border-black-neutral-4"
              placeholder="Type your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex justify-end mt-2 mr-3">
            <button
              className="btn btn-primary bg-primal-base border-primal-base"
              disabled={reply.isPending}
              onClick={() => {
                if (message) {
                  reply.mutate(message);
                  setMessage('');
                }
              }}
            >
              <LoadingSpinner isLoading={reply.isPending}>Respond</LoadingSpinner>
            </button>
          </div>
        </div>
      ) : (
        <div className="h-full text-center place-content-center text-lg text-black-base/40">
          Select a ticket to chat
        </div>
      )}
    </div>
  );
}
