import PageTitle from '../../app/components/page/PageTitle.tsx';
import Pills from '../../app/components/Pills.tsx';
import { PromotionType } from './domain/types.ts';
import PageSearchRow from '../../app/components/page/PageSearchRow.tsx';
import { useFetchPromotionsQuery } from './domain/usecase.ts';
import PageTable from '../../app/components/page/PageTable.tsx';
import PageAction from '../../app/components/page/PageAction.tsx';
import { useMemo } from 'react';
import GiftCardItem from './components/GiftCardItem.tsx';
import { useNavigate } from 'react-router-dom';
import PromotionsHeader from './components/PromotionsHeader.tsx';
import PromotionRow from './components/PromotionRow.tsx';

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
        onButton={() =>
          navigate(
            isGifts
              ? '/promotions/gifts/new'
              : tab === PromotionType.purchased
                ? '/promotions/gifts/send'
                : '/promotions/new'
          )
        }
      />
      <PageTable
        isFetching={isPending}
        emptyMessage={error?.message ?? (items.length == 0 ? 'No item found' : undefined)}
        header={
          !isGifts && (
            <PromotionsHeader isPurchase={isPurchase}>
              <th>{_PageAction}</th>
            </PromotionsHeader>
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
              return (
                <PromotionRow
                  key={item.id}
                  isPurchase={isPurchase}
                  {...item}
                  // onClick={() => navigate(`/${type}s/${user.id}`)}
                >
                  <td>{_PageAction}</td>
                </PromotionRow>
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
