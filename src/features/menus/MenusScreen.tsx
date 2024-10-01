import {
  GenericPageSearchRow,
  GenericPageTitle,
  GenericTable,
  GenericTableAction,
  GenericTableActions
} from '../../app/components/GenericPage.tsx';
import { useMemo, useState } from 'react';
import { useGetAllMenusQuery } from '../../app/api.ts';

export default function MenusScreen() {
  const filters = useMemo(() => ['all', 'approved', 'unapproved'], []);
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

  const [page] = useState(1);
  const [query, setQuery] = useState<string>();
  const [filter, setFilter] = useState<string>(filters[0]);
  // const [selected, setSelected] = useState<string[]>([]);

  const { data: response, isFetching } = useGetAllMenusQuery(
    {
      page_number: page,
      menu_status: filter === 'all' ? undefined : filter
    },
    {
      refetchOnMountOrArgChange: true, // Forces a refetch on page load
      refetchOnReconnect: true, // Refetch when the browser reconnects
      refetchOnFocus: true // Refetch when the user focuses the window
    }
  );

  const menus = useMemo(() => {
    // if (!query || !response?.data) {
    //   return response?.data || [];
    // }
    //
    // return response?.data?.filter((user) => {
    //   const cleanedQuery = query?.toLowerCase();
    //   return (
    //     user.first_name.toLowerCase().includes(cleanedQuery) ||
    //     user.last_name.toLowerCase().includes(cleanedQuery)
    //   );
    // });
    return [];
  }, [query, response?.data]);

  return (
    <div>
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
        isFetching={isFetching}
        emptyMessage={menus.length == 0 ? 'No menus found' : undefined}
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
        body={<></>}
        // body={users.map((user) => {
        //   const isSelected = selected.includes(user.id);
        //   return (
        //     <tr key={user.id} className={isSelected ? 'active' : undefined}>
        //       <td>E-mail</td>
        //       <td>Address</td>
        //       <td>
        //         <GenericTableActions>
        //           {dropdown.map((entry) => (
        //             <GenericTableAction
        //               key={entry.title}
        //               icon={entry.icon}
        //               text={entry.title}
        //               onClick={() => {}}
        //             />
        //           ))}
        //         </GenericTableActions>
        //       </td>
        //     </tr>
        //   );
        // })}
        page={1}
        pages={1}
        onPageChange={() => {}}
      />
    </div>
  );
}
