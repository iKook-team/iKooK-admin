import CalendarIcon from '../../app/assets/icons/calendar.svg';
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
import { DateTime } from 'luxon';
import GiftCardItem from './components/GiftCardItem.tsx';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

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
  const navigate = useNavigate();

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
  const DateIcon = () => (
    <ReactSVG
      src={CalendarIcon}
      wrapper="svg"
      className="text-black-base/40 w-3 h-3 inline-block mr-1"
    />
  );

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
        onButton={() =>
          navigate(tab === PromotionType.gifts ? '/promotions/gifts/new' : '/promotions/new')
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
                  {title === 'Date' ? (
                    <>
                      <DateIcon /> Date
                    </>
                  ) : (
                    title
                  )}
                </th>
              ))}
              <th>{_PageAction}</th>
            </tr>
          )
        }
        useDefaultWrapper={!isGifts}
        body={
          isGifts ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-8 xl:gap-y-16">
              {items.map((item) => (
                <GiftCardItem key={item.id} {...item} />
              ))}
            </div>
          ) : (
            items.map((item) => {
              const user = isPurchase ? item.purchased_by : item?.created_by;
              const active = isPurchase ? item.redeemed : item.is_active;
              return (
                <tr
                  key={item.id}
                  // onClick={() => navigate(`/${type}s/${user.id}`)}
                >
                  <td>
                    <IdCell id={item.id} />
                  </td>
                  <td>{isPurchase ? item.card_number : item.promo_code}</td>
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
                  <td>
                    <DateIcon />
                    {isPurchase
                      ? getDate(item.created_at, true)
                      : `${getDate(item.duration_to)} - ${getDate(item.duration_from)}`}
                  </td>
                  <td>
                    {isPurchase ? formatCurrency(item.amount, item.currency) : item.percentage}
                  </td>
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
                      circleColor={active ? 'bg-green' : 'bg-red-base'}
                      textColor={active ? 'text-green' : 'text-red-base'}
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

function getDate(date: string | undefined, isPurchase: boolean = false) {
  const dateTime = DateTime.fromISO(date ?? new Date().toISOString());

  if (isPurchase) {
    return dateTime.toFormat(`${dateTime.day} MMMM, yyyy`);
  } else {
    return dateTime.toFormat(`${dateTime.day} MMM`);
  }
}
