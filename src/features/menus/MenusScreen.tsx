import PageTable from '../../app/components/page/PageTable.tsx';
import { useMemo, useRef, useState } from 'react';
import { useFetchMenusQuery } from './domain/usecase.ts';
import PageTitle from '../../app/components/page/PageTitle.tsx';
import PageSearchRow from '../../app/components/page/PageSearchRow.tsx';
import ChangeMenuStatusModal from './components/ChangeMenuStatusModal.tsx';
import PageAction from '../../app/components/page/PageAction.tsx';
import { PageActionItem } from '../../app/components/page/types.ts';
import { Menu } from './data/model.ts';
import MenuRow from './components/MenuRow.tsx';
import MenuHeader from './components/MenuHeader.tsx';

export default function MenusScreen() {
  const [selectedMenu, setSelectedMenu] = useState<Menu>();

  const actionItems = useMemo<PageActionItem[]>(
    () => [
      { title: 'Edit', icon: 'edit' },
      { title: 'Change Status', icon: 'reset' },
      { title: 'Delete', icon: 'delete' }
    ],
    []
  );

  const changeStatusRef = useRef<HTMLDialogElement>(null);

  const {
    isPending,
    error,
    menus,
    filter,
    setFilter,
    filters,
    query,
    setQuery,
    totalCount,
    page,
    setPage,
    numberOfPages
  } = useFetchMenusQuery();

  const onAction = (action: PageActionItem, menu?: Menu) => {
    const icon = action.icon;
    setSelectedMenu(menu);
    if (icon === 'reset') {
      changeStatusRef.current?.showModal();
    }
    console.log(action);
  };

  return (
    <>
      <PageTitle title="Menus" />
      <PageSearchRow
        className="mt-4 mb-6 w-full"
        search={query}
        onSearch={setQuery}
        dropdown={filter}
        dropdownOptions={filters}
        onDropdown={setFilter}
        button="New Menu"
      />
      <PageTable
        isFetching={isPending}
        emptyMessage={error?.message || (menus.length == 0 ? 'No menus found' : undefined)}
        header={
          <MenuHeader>
            <th>
              <PageAction items={actionItems} onItemClick={onAction} />
            </th>
          </MenuHeader>
        }
        body={menus.map((menu) => (
          <MenuRow key={menu.id} {...menu}>
            <td>
              <PageAction items={actionItems} onItemClick={(action) => onAction(action, menu)} />
            </td>
          </MenuRow>
        ))}
        page={page}
        numberOfPages={numberOfPages}
        onPageChange={setPage}
        pageItemCount={menus.length}
        totalItemCount={totalCount}
      />
      <ChangeMenuStatusModal ref={changeStatusRef} menu={selectedMenu} />
    </>
  );
}
