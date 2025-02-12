import PageTitle from '../../app/components/page/PageTitle.tsx';
import PageSearchRow from '../../app/components/page/PageSearchRow.tsx';
import { useFetchWithdrawalsQuery } from './domain/usecase.ts';
import PageTable from '../../app/components/page/PageTable.tsx';
import { useMemo, useRef } from 'react';
import CalendarIcon from '../../app/components/CalendarIcon.tsx';
import { formatCurrency, getDateWithOrdinal } from '../../utils/helper.ts';
import UsernameAndImage from '../users/components/UsernameAndImage.tsx';
import ItemStatus from '../../app/components/ItemStatus.tsx';
import { capitalize } from '../../utils/strings.ts';
import CreateWithdrawalModal from './components/CreateWithdrawalModal.tsx';

export default function WithdrawalScreen() {
  const header = useMemo(() => ['Chefs', 'Date', 'Amount Requested', 'Status'], []);

  const createWithdrawalRef = useRef<HTMLDialogElement>(null);

  const {
    query,
    setQuery,
    withdrawals,
    filter,
    filters,
    setFilter,
    isPending,
    error,
    page,
    setPage,
    numberOfPages,
    totalCount
  } = useFetchWithdrawalsQuery();

  return (
    <>
      <PageTitle title="Withdrawal" />
      <PageSearchRow
        className="mt-4 mb-6 w-full"
        search={query}
        onSearch={setQuery}
        dropdown={filter}
        dropdownOptions={filters}
        onDropdown={setFilter}
        button="Withdrawal"
        onButton={() => createWithdrawalRef.current?.showModal()}
      />
      <PageTable
        isFetching={isPending}
        emptyMessage={error?.message ?? (withdrawals.length == 0 ? 'No item found' : undefined)}
        header={
          <tr>
            {header.map((title) => (
              <th key={title} className="text-left">
                {title === 'Date' ? (
                  <>
                    <CalendarIcon /> Date
                  </>
                ) : (
                  title
                )}
              </th>
            ))}
          </tr>
        }
        body={withdrawals.map((withdrawal) => {
          const { chef, status } = withdrawal;
          const isSuccessful = status === 'successful' || status === 'success';
          const isPending = status === 'pending';
          return (
            <tr key={withdrawal.id}>
              <td>
                {chef ? (
                  <UsernameAndImage
                    name={`${chef.first_name} ${chef.last_name}`}
                    image={chef.photo}
                  />
                ) : (
                  '-'
                )}
              </td>

              <td>
                <CalendarIcon />
                {getDateWithOrdinal(withdrawal.created_at, true)}
              </td>
              <td>{formatCurrency(Number(withdrawal.amount), withdrawal.currency)}</td>
              <td>
                <ItemStatus
                  title={capitalize(isSuccessful ? 'completed' : status)}
                  circleColor={isSuccessful ? 'bg-green' : isPending ? 'bg-primary' : 'bg-red-base'}
                  textColor={
                    isSuccessful ? 'text-green' : isPending ? 'text-primary' : 'text-red-base'
                  }
                />
              </td>
            </tr>
          );
        })}
        page={page}
        numberOfPages={numberOfPages}
        totalItemCount={totalCount}
        pageItemCount={withdrawals.length}
        onPageChange={setPage}
      />
      <CreateWithdrawalModal ref={createWithdrawalRef} />
    </>
  );
}
