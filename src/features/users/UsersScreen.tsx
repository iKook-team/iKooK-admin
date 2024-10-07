import { UserType } from './domain/types.ts';
import {
  GenericPageSearchRow,
  GenericPageTitle,
  GenericTable,
  GenericTableAction,
  GenericTableActions
} from '../../app/components/GenericPage.tsx';
import { ChangeEventHandler, useMemo, useState } from 'react';
import UserNameAndImage from './components/UserNameAndImage.tsx';
import { useFetchUsersQuery } from './domain/usecase.ts';
import VerificationStatus from '../../app/components/VerificationStatus.tsx';

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

  const { isPending, users, error } = useFetchUsersQuery({
    type,
    verified: filter === 'all' ? undefined : filter === 'verified',
    query
  });

  const toggleSelection = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const selectAll: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSelected(event.target.checked ? users.map((user) => user.id) : []);
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
        isFetching={isPending}
        emptyMessage={
          error?.message ||
          (users.length == 0
            ? type === UserType.host
              ? 'No users found'
              : 'No chefs found'
            : undefined)
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
              <td>{user.email}</td>
              <td>{user.address}</td>
              {type === UserType.host ? (
                <td>{user.mobile}</td>
              ) : (
                <>
                  <td>Wallet</td>
                  <td>{user.rating}</td>
                </>
              )}
              <td>
                <VerificationStatus
                  title={user.verified ? 'Verified' : 'Not verified'}
                  circleColor={user.verified ? 'bg-green' : 'bg-red'}
                  textColor={user.verified ? 'text-green' : 'text-red'}
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
          );
        })}
        page={1}
        pages={1}
        onPageChange={() => {}}
      />
    </div>
  );
}
