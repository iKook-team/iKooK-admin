import { useGetSupportTicket } from './domain/usecase.ts';
import { DropdownField } from '../../app/components/InputField.tsx';

export function SupportInfo({ ticketId }: { ticketId: string }) {
  const ticket = useGetSupportTicket(ticketId);
  return (
    <div>
      {ticket ? (
        <div>
          <DropdownField
            label="Ticket action"
            label-class-name="text-sm font-medium text-charcoal"
            value={ticket.status}
            options={[ticket.status]}
          />
          <h3 className="font-bold text-black-base text-sm mt-5 mb-4">User Information</h3>
          <div className="flex flex-col gap-3">
            <InfoRow title="Name" content={`${ticket.user.first_name} ${ticket.user.last_name}`} />
            <InfoRow title="Phone" content={ticket.user.mobile} />
            <InfoRow title="Email" content={ticket.user.email} />
            <InfoRow title="Location" content={`${ticket.user.location}, ${ticket.user.country}`} />
          </div>
        </div>
      ) : (
        <div className="h-full text-center place-content-center text-lg text-black-base/40">
          Select a ticket to view info
        </div>
      )}
    </div>
  );
}

function InfoRow({ title, content }: { title: string; content: string }) {
  return (
    <div className="flex flex-row justify-between items-center text-xs text-gray-granite">
      <h3 className="font-bold">{title}</h3>
      <p>{content}</p>
    </div>
  );
}
