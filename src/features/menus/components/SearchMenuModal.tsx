import { Ref, useEffect } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import InputField from '../../../app/components/InputField.tsx';
import { FaSearch } from 'react-icons/fa';
import PageTable from '../../../app/components/page/PageTable.tsx';
import { useFetchMenusQuery } from '../domain/usecase.ts';
import MenuRow from './MenuRow.tsx';
import MenusHeader from './MenusHeader.tsx';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import { MenuStatus } from '../data/model.ts';

interface SearchMenuModalProps {
  ref: Ref<HTMLDialogElement>;
  onMenuSelected: (menuId: number) => void;
}

export default function SearchMenuModal({ ref, onMenuSelected }: SearchMenuModalProps) {
  const {
    isPending,
    menus,
    error,
    query,
    setQuery,
    page,
    setPage,
    numberOfPages,
    totalCount,
    setFilter
  } = useFetchMenusQuery();

  useEffect(() => {
    // only show active menus
    setFilter(MenuStatus.active);
  }, [setFilter]);

  return (
    <PageModal ref={ref} id="search-menu-modal" title="Select Menu" className="lg:min-w-[50rem]">
      <InputField
        className="w-full mb-6"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name of Menu"
        trailing={<FaSearch />}
      />
      <PageTable
        isFetching={isPending}
        emptyMessage={error?.message || (menus.length == 0 ? 'No menus found' : undefined)}
        header={<MenusHeader />}
        body={menus.map((menu) => (
          <MenuRow
            key={menu.id}
            {...menu}
            onClick={() => {
              onMenuSelected(menu.id);
              getCurrentFromRef(ref)?.close();
            }}
          />
        ))}
        page={page}
        numberOfPages={numberOfPages}
        onPageChange={setPage}
        pageItemCount={menus.length}
        totalItemCount={totalCount}
      />
    </PageModal>
  );
}
