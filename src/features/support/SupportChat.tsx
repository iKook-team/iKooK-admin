import { useGetSupportTicket } from './domain/usecase.ts';
import { useSearchParams } from 'react-router-dom';
import SupportChatItem from './components/SupportChatItem.tsx';
import { Fragment } from 'react';

export function SupportChat() {
  const [params, _] = useSearchParams();
  const ticket = useGetSupportTicket(params.get('ticket_id') ?? '');
  return (
    <div className="w-full border-x border-x-black-neutral-4">
      {ticket ? (
        <div>
          <h2 className="text-sm font-bold text-black-base p-5 pb-6 border-b border-b-black-neutral-4 mb-10">
            {ticket.title}
          </h2>
          <div className="px-3">
            {ticket.replies.map((message, index) => (
              <Fragment key={index}>
                <SupportChatItem
                  user={message.is_admin ? null : ticket.user}
                  date={message.created_at}
                  content={message.message}
                />
                <div className="h-[1px] w-full mt-5 mb-6 bg-black-neutral-4" />
              </Fragment>
            ))}
            <textarea
              className="w-full h-32 p-4 rounded-md border border-black-neutral-4"
              placeholder="Type your message here"
            />
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
