import PageSearchRow from '../../app/components/page/PageSearchRow.tsx';
import { useFetchSupportTicketsQuery } from './domain/usecase.ts';
import SupportTicketItem from './components/SupportTicketItem.tsx';
import { PaginationControls } from '../../app/components/page/PageTable.tsx';

interface SupportTicketsProps {
  selected: number | null;
  setSelected: (ticket: number) => void;
}

export function SupportTickets({ selected, setSelected }: SupportTicketsProps) {
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
              key={ticket.id}
              {...ticket}
              onClick={() => setSelected(ticket.id)}
              isActive={selected === ticket.id}
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
