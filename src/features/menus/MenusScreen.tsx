import PageTable from '../../app/components/page/PageTable.tsx';
import { useMemo, useRef, useState } from 'react';
import { useFetchMenusQuery } from './domain/usecase.ts';
import UserNameAndImage from '../users/components/UserNameAndImage.tsx';
import VerificationStatus from '../../app/components/VerificationStatus.tsx';
import { capitalize } from '../../utils/strings.ts';
import IdCell from '../../app/components/IdCell.tsx';
import PageTitle from '../../app/components/page/PageTitle.tsx';
import PageSearchRow from '../../app/components/page/PageSearchRow.tsx';
import ChangeMenuStatusModal from './components/ChangeMenuStatusModal.tsx';
import PageAction from '../../app/components/page/PageAction.tsx';
import { PageActionItem } from '../../app/components/page/types.ts';
import { Menu } from './data/model.ts';

export default function MenusScreen() {
  const [selectedMenu, setSelectedMenu] = useState<Menu>();

  const header = useMemo(
    () => ['ID', 'Menu', 'Chef', 'Availability', 'Starting Price', 'Status'],
    []
  );

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
          <tr>
            {header.map((title) => (
              <th key={title} className="text-left">
                {title}
              </th>
            ))}
            <th>
              <PageAction items={actionItems} onItemClick={onAction} />
            </th>
          </tr>
        }
        body={menus.map((menu) => (
          <tr key={menu.id}>
            <td>
              <IdCell id={menu.id} />
            </td>
            <td className="capitalize">{menu.menuName}</td>
            <td>
              <UserNameAndImage
                name={`${menu.chefID.first_name} ${menu.chefID.last_name}`}
                image={menu.chefID.photo}
              />
            </td>
            <td></td>
            <td></td>
            <td>
              <VerificationStatus
                title={capitalize(menu.status)}
                circleColor={
                  menu.status === 'approved'
                    ? 'bg-green'
                    : menu.status === 'deleted' || menu.status === 'unapproved'
                      ? 'bg-red'
                      : 'bg-jordy-blue'
                }
                textColor={
                  menu.status === 'approved'
                    ? 'text-green'
                    : menu.status === 'deleted' || menu.status === 'unapproved'
                      ? 'text-red'
                      : 'text-jordy-blue'
                }
              />
            </td>
            <td>
              <PageAction items={actionItems} onItemClick={(action) => onAction(action, menu)} />
            </td>
          </tr>
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
