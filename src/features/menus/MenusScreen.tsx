import {
  GenericPageSearchRow,
  GenericPageTitle,
  GenericTable,
  GenericTableAction,
  GenericTableActions
} from '../../app/components/GenericPage.tsx';
import { useMemo } from 'react';
import { useFetchMenusQuery } from './domain/usecase.ts';
import UserNameAndImage from '../users/components/UserNameAndImage.tsx';
import VerificationStatus from '../../app/components/VerificationStatus.tsx';
import { capitalize } from '../../utils/strings.ts';
import IdCell from '../../app/components/IdCell.tsx';

export default function MenusScreen() {
  const header = useMemo(
    () => ['ID', 'Menu', 'Chef', 'Availability', 'Starting Price', 'Status'],
    []
  );
  const dropdown = useMemo(
    () => [
      { title: 'Edit', icon: 'edit' },
      { title: 'Change Status', icon: 'reset' },
      { title: 'Delete', icon: 'delete' }
    ],
    []
  );

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

  return (
    <>
      <GenericPageTitle title="Menus" />
      <GenericPageSearchRow
        className="mt-4 mb-6 w-full"
        search={query}
        onSearch={setQuery}
        dropdown={filter}
        dropdownOptions={filters}
        onDropdown={setFilter}
        button="New Menu"
      />
      <GenericTable
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
              <GenericTableActions>
                {dropdown.map((entry) => (
                  <GenericTableAction
                    key={entry.title}
                    icon={entry.icon}
                    text={entry.title}
                    onClick={() => {}}
                  />
                ))}
              </GenericTableActions>
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
              <GenericTableActions>
                {dropdown.map((entry) => (
                  <GenericTableAction
                    key={entry.title}
                    icon={entry.icon}
                    text={entry.title}
                    onClick={() => {}}
                  />
                ))}
              </GenericTableActions>
            </td>
          </tr>
        ))}
        page={page}
        numberOfPages={numberOfPages}
        onPageChange={setPage}
        pageItemCount={menus.length}
        totalItemCount={totalCount}
      />
    </>
  );
}
