import { Ref } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import InputField from '../../../app/components/InputField.tsx';
import { FaSearch } from 'react-icons/fa';
import PageTable from '../../../app/components/page/PageTable.tsx';
import { useFetchPromotionsQuery } from '../domain/usecase.ts';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import PromotionRow from './PromotionRow.tsx';
import PromotionsHeader from './PromotionsHeader.tsx';

interface SearchPromotionsModalProps {
  ref: Ref<HTMLDialogElement>;
  onPromotionSelected: (id: number) => void;
  isPurchase: boolean;
}

export default function SearchPromotionsModal({
  ref,
  isPurchase,
  onPromotionSelected
}: SearchPromotionsModalProps) {
  const { isPending, items, error, query, setQuery, page, setPage, numberOfPages, totalCount } =
    useFetchPromotionsQuery();

  return (
    <PageModal
      ref={ref}
      id="search-promotions-modal"
      title="Select Gift"
      className="lg:min-w-[50rem]"
    >
      <InputField
        className="w-full mb-6"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name of Gift"
        trailing={<FaSearch />}
      />
      <PageTable
        isFetching={isPending}
        emptyMessage={error?.message || (items.length == 0 ? 'No items found' : undefined)}
        header={<PromotionsHeader isPurchase={isPurchase} />}
        body={items.map((gift) => (
          <PromotionRow
            key={gift.id}
            {...gift}
            isPurchase={isPurchase}
            onClick={() => {
              onPromotionSelected(gift.id);
              getCurrentFromRef(ref)?.close();
            }}
          />
        ))}
        page={page}
        numberOfPages={numberOfPages}
        onPageChange={setPage}
        pageItemCount={items.length}
        totalItemCount={totalCount}
      />
    </PageModal>
  );
}
