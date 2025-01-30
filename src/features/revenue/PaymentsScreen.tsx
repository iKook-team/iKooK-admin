import PageTitle from '../../app/components/page/PageTitle.tsx';
import PageSearchRow from '../../app/components/page/PageSearchRow.tsx';
import PageTable from '../../app/components/page/PageTable.tsx';
import ItemStatus from '../../app/components/ItemStatus.tsx';
import { capitalize } from '../../utils/strings.ts';
import { useFetchPaymentsQuery } from './domain/usecase.ts';
import PaymentsHeader from './components/PaymentsHeader.tsx';
import PaymentRow from './components/PaymentRow.tsx';

export default function PaymentsScreen() {
  const {
    query,
    setQuery,
    payments,
    filter,
    filters,
    setFilter,
    isPending,
    error,
    page,
    setPage,
    numberOfPages,
    totalCount
  } = useFetchPaymentsQuery();

  return (
    <>
      <PageTitle title="Payments" />
      <PageSearchRow
        className="mt-4 mb-6 w-full"
        search={query}
        onSearch={setQuery}
        dropdown={filter}
        dropdownOptions={filters}
        onDropdown={setFilter}
      />
      <PageTable
        isFetching={isPending}
        emptyMessage={error?.message ?? (payments.length == 0 ? 'No item found' : undefined)}
        header={
          <PaymentsHeader>
            <th>Status</th>
          </PaymentsHeader>
        }
        body={payments.map((payment) => {
          const { status } = payment;
          const isSuccessful = status === 'successful' || status === 'success';
          const isPending = status === 'pending';
          return (
            <PaymentRow key={payment.id} {...payment}>
              <td>
                <ItemStatus
                  title={capitalize(isSuccessful ? 'completed' : status)}
                  circleColor={
                    isSuccessful ? 'bg-green' : isPending ? 'bg-blue-vista' : 'bg-red-base'
                  }
                  textColor={
                    isSuccessful ? 'text-green' : isPending ? 'text-blue-vista' : 'text-red-base'
                  }
                />
              </td>
            </PaymentRow>
          );
        })}
        page={page}
        numberOfPages={numberOfPages}
        totalItemCount={totalCount}
        pageItemCount={payments.length}
        onPageChange={setPage}
      />
    </>
  );
}
