import { UserType } from './domain/types.ts';
import {
  GenericPageSearchRow,
  GenericPageTitle,
  GenericTable,
  GenericTableAction,
  GenericTableActions
} from '../../app/components/GenericPage.tsx';
import { ChangeEventHandler, useMemo, useState } from 'react';
import { useGetAllUsersQuery } from '../../app/api.ts';
import UserNameAndImage from './components/UserNameAndImage.tsx';
import UserVerificationStatus from './components/UserVerificationStatus.tsx';

type UsersScreenProps = {
  type: UserType;
};

export default function UsersScreen({ type }: UsersScreenProps) {
  const filters = useMemo(() => ['all', 'verified', 'unverified'], []);
  const header = useMemo(
    () => [
      'Name',
      'Email',
      'Address',
      ...(type == UserType.host ? ['Phone No'] : ['Wallet', 'Rating']),
      'Status'
    ],
    [type]
  );
  const dropdown = useMemo(
    () => [
      { title: 'Edit', icon: 'edit' },
      ...(type == UserType.host ? [{ title: 'Approve docs', icon: 'approve-document' }] : []),
      { title: 'Suspend', icon: 'suspend' },
      { title: 'Delete', icon: 'delete' },
      { title: 'Reset Password', icon: 'reset' },

      ...(type == UserType.chef ? [{ title: 'Verification', icon: 'check' }] : [])
    ],
    [type]
  );

  const [query, setQuery] = useState<string>();
  const [filter, setFilter] = useState<string>(filters[0]);
  const [selected, setSelected] = useState<string[]>([]);

  const { data: response, isFetching } = useGetAllUsersQuery({
    user_type: type === UserType.host ? 'host' : 'chef',
    verified: filter === 'all' ? undefined : filter === 'verified'
  });

  const users = useMemo(() => {
    if (!query || !response?.data) {
      return response?.data || [];
    }

    return response?.data?.filter((user) => {
      const cleanedQuery = query?.toLowerCase();
      return (
        user.first_name.toLowerCase().includes(cleanedQuery) ||
        user.last_name.toLowerCase().includes(cleanedQuery)
      );
    });
  }, [query, response?.data]);

  const toggleSelection = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const selectAll: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSelected(event.target.checked ? response?.data?.map((user) => user.id) || [] : []);
  };

  return (
    <div>
      <GenericPageTitle title={type === UserType.host ? 'Users' : 'Chefs'} />
      <GenericPageSearchRow
        className="mt-4 mb-6 w-full"
        search={query}
        onSearch={setQuery}
        dropdown={filter}
        dropdownOptions={filters}
        onDropdown={setFilter}
        button={type === UserType.host ? 'New User' : 'New Chef'}
      />
      <GenericTable
        isFetching={isFetching}
        emptyMessage={
          users.length == 0
            ? type === UserType.host
              ? 'No users found'
              : 'No chefs found'
            : undefined
        }
        header={
          <tr>
            <th>
              <label>
                <input className="checkbox" type="checkbox" onChange={selectAll} />
              </label>
            </th>
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
        body={users.map((user) => {
          const isSelected = selected.includes(user.id);
          return (
            <tr key={user.id} className={isSelected ? 'active' : undefined}>
              <td>
                <label>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={isSelected}
                    onClick={() => toggleSelection(user.id)}
                    readOnly={true}
                  />
                </label>
              </td>
              <td>
                <UserNameAndImage
                  name={`${user.first_name} ${user.last_name}`}
                  image={user.photo}
                  isActive={user.is_active}
                />
              </td>
              <td>E-mail</td>
              <td>Address</td>
              {type === UserType.host ? (
                <td>Phone No</td>
              ) : (
                <>
                  <td>Wallet</td>
                  <td>Rating</td>
                </>
              )}
              <td>
                <UserVerificationStatus isVerified={user.verified} />
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
          );
        })}
        page={1}
        pages={1}
        onPageChange={() => {}}
      />
    </div>
  );
}
