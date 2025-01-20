import PageTitle from '../../app/components/page/PageTitle.tsx';
import Pills from '../../app/components/Pills.tsx';
import { PromotionType } from './domain/types.ts';
import PageSearchRow from '../../app/components/page/PageSearchRow.tsx';
import { useFetchPromotionsQuery } from './domain/usecase.ts';
import PageTable from '../../app/components/page/PageTable.tsx';
import PageAction from '../../app/components/page/PageAction.tsx';
import { useMemo } from 'react';
import IdCell from '../../app/components/IdCell.tsx';
import UsernameAndImage from '../users/components/UsernameAndImage.tsx';
import VerificationStatus from '../../app/components/VerificationStatus.tsx';
import { formatCurrency } from '../../utils/formatter.ts';
import EmptyCell from '../../app/components/EmptyCell.tsx';
import moment from 'moment';
import GiftCardItem from './components/GiftCardItem.tsx';

export default function PromotionsScreen() {
  const {
    query,
    setQuery,
    tab,
    setTab,
    items,
    filter,
    filters,
    setFilter,
    isPending,
    error,
    page,
    setPage,
    numberOfPages,
    totalCount
  } = useFetchPromotionsQuery();

  const isGifts = tab === PromotionType.gifts;
  const isPurchase = tab === PromotionType.purchased;
  const header = useMemo(
    () => [
      'ID',
      isPurchase ? 'Card Number' : 'Promo Code',
      isPurchase ? 'Purchased by' : 'Created by',
      'Date',
      isPurchase ? 'Amount' : '% Off',
      'Status'
    ],
    [isPurchase]
  );
  const _PageAction = useMemo(() => <PageAction items={[]} />, []);

  return (
    <>
      <PageTitle title="Gift Experience" />
      <Pills active={tab} setActive={setTab} items={Object.values(PromotionType)} />
      <PageSearchRow
        className="mt-4 mb-6 w-full"
        search={query}
        onSearch={setQuery}
        dropdown={filter}
        dropdownOptions={filters}
        onDropdown={setFilter}
        button={
          isGifts ? 'New Gift' : tab === PromotionType.purchased ? 'Send Gift' : 'New Promo Code'
        }
      />
      <PageTable
        isFetching={isPending}
        emptyMessage={error?.message ?? (items.length == 0 ? 'No item found' : undefined)}
        header={
          !isGifts && (
            <tr>
              {header.map((title) => (
                <th key={title} className="text-left">
                  {title}
                </th>
              ))}
              <th>{_PageAction}</th>
            </tr>
          )
        }
        useDefaultWrapper={!isGifts}
        body={
          isGifts ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
              {items.map((item) => (
                <GiftCardItem key={item.id} {...item} />
              ))}
            </div>
          ) : (
            items.map((item) => {
              const user = item.purchased_by;
              const active = isPurchase ? item.redeemed : item.is_active;
              return (
                <tr
                  key={item.id}
                  // onClick={() => navigate(`/${type}s/${user.id}`)}
                >
                  <td>
                    <IdCell id={item.id} />
                  </td>
                  <td>{item.card_number}</td>
                  <td>
                    {user ? (
                      <UsernameAndImage
                        name={`${user?.first_name} ${user?.last_name}`}
                        image={user?.photo}
                      />
                    ) : (
                      <EmptyCell />
                    )}
                  </td>
                  <td>{moment(item.created_at).format('ll')}</td>
                  <td>{formatCurrency(item.amount, item.currency)}</td>
                  <td>
                    <VerificationStatus
                      title={
                        active
                          ? isPurchase
                            ? 'Redeemed'
                            : 'Active'
                          : isPurchase
                            ? 'Unused'
                            : 'Expired'
                      }
                      circleColor={active ? 'bg-green' : 'bg-red'}
                      textColor={active ? 'text-green' : 'text-red'}
                    />
                  </td>
                  <td>{_PageAction}</td>
                </tr>
              );
            })
          )
        }
        page={page}
        numberOfPages={numberOfPages}
        totalItemCount={totalCount}
        pageItemCount={items.length}
        onPageChange={setPage}
      />
    </>
  );
}
