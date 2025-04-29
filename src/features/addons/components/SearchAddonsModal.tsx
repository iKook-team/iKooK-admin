import { Ref } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import InputField from '../../../app/components/InputField.tsx';
import { FaSearch } from 'react-icons/fa';
import PageTable from '../../../app/components/page/PageTable.tsx';
import { useFetchAddonsQuery } from '../domain/usecase.ts';
import AddonsHeader from './AddonsHeader.tsx';
import AddonRow from './AddonRow.tsx';
import { AddonType } from '../domain/type.ts';
import { getCurrentFromRef } from '../../../utils/ref.ts';

interface SearchAddonsModalProps {
  ref: Ref<HTMLDialogElement>;
  type: AddonType;
  onSelected: (id: number) => void;
}

export default function SearchAddonsModal({ ref, type, onSelected }: SearchAddonsModalProps) {
  const { isPending, error, addons, query, setQuery, totalCount, page, setPage, numberOfPages } =
    useFetchAddonsQuery(type);

  return (
    <PageModal
      ref={ref}
      id="search-addons-modal"
      title={`Select ${type}`}
      className="lg:min-w-[50rem]"
    >
      <InputField
        className="w-full mb-6"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search by name of ${type}`}
        trailing={<FaSearch />}
      />
      <PageTable
        isFetching={isPending}
        emptyMessage={error?.message || (addons.length == 0 ? 'No addons found' : undefined)}
        header={<AddonsHeader type={type} />}
        body={addons.map((addon) => (
          <AddonRow
            key={addon.id}
            {...addon}
            onClick={() => {
              onSelected(addon.id);
              getCurrentFromRef(ref)?.close();
            }}
          />
        ))}
        page={page}
        numberOfPages={numberOfPages}
        onPageChange={setPage}
        pageItemCount={addons.length}
        totalItemCount={totalCount}
      />
    </PageModal>
  );
}
