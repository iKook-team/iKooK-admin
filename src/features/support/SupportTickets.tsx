import PageSearchRow from '../../app/components/page/PageSearchRow.tsx';
import { useFetchSupportTicketsQuery } from './domain/usecase.ts';
import SupportTicketItem from './components/SupportTicketItem.tsx';
import { PaginationControls } from '../../app/components/page/PageTable.tsx';

export function SupportTickets({
  selected,
  setSelected
}: {
  selected: string;
  setSelected: (id: string) => void;
}) {
  const {
    query,
    setQuery,
    filter,
    filters,
    setFilter,
    isPending,
    error,
    tickets,
    page,
    setPage,
    numberOfPages,
    totalCount
  } = useFetchSupportTicketsQuery();
  return (
    <div>
      <PageSearchRow
        search={query}
        onSearch={setQuery}
        dropdown={filter}
        dropdownOptions={filters}
        onDropdown={setFilter}
      />
      {isPending ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className="flex flex-col gap-2 my-6">
          {tickets.map((ticket) => (
            <SupportTicketItem
              key={ticket.ticket_id}
              {...ticket}
              onClick={() => setSelected(ticket.ticket_id)}
              isActive={selected === ticket.ticket_id}
            />
          ))}
        </div>
      )}
      <PaginationControls
        page={page}
        numberOfPages={numberOfPages}
        onPageChange={setPage}
        pageItemCount={tickets.length}
        totalItemCount={totalCount}
      />
    </div>
  );
}
