import { UserType } from './domain/types.ts';
import PageTable from '../../app/components/page/PageTable.tsx';
import { ChangeEventHandler, useMemo, useRef, useState } from 'react';
import UserNameAndImage from './components/UserNameAndImage.tsx';
import { useFetchUsersQuery } from './domain/usecase.ts';
import VerificationStatus from '../../app/components/VerificationStatus.tsx';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../app/components/page/PageTitle.tsx';
import PageSearchRow from '../../app/components/page/PageSearchRow.tsx';
import PageAction from '../../app/components/page/PageAction.tsx';
import { PageActionItem } from '../../app/components/page/types.ts';
import ToggleUserActiveModal from './components/ToggleUserActiveModal.tsx';
import { User } from './data/model.ts';

type UsersScreenProps = {
  type: UserType;
};

export default function UsersScreen({ type }: UsersScreenProps) {
  const navigate = useNavigate();

  // const filters = useMemo(() => ['all', 'verified', 'unverified'], []);

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

  const suspendUserRef = useRef<HTMLDialogElement>(null);

  // const [query, setQuery] = useState<string>();
  // const [filter, setFilter] = useState<string>(filters[0]);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();

  const {
  
    isPending,
    error,
    users,
    filter,
    setFilter,
    filters,
    query,
    setQuery,
    totalCount,
    page,
    setPage,
    numberOfPages
  } = useFetchUsersQuery(
    {
    type,
    // verified: filter === 'all' ? undefined : filter === 'verified',
    // query
  }
);

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

  const onAction = (action: PageActionItem, user?: User) => {
    setSelectedUser(user);
    switch (action.icon) {
      case 'suspend':
        suspendUserRef.current?.showModal();
        break;
    }
  };

  return (
    <>
      <PageTitle title={type === UserType.host ? 'Users' : 'Chefs'} />
      <PageSearchRow
        className="mt-4 mb-6 w-full"
        search={query}
        onSearch={setQuery}
        dropdown={filter}
        dropdownOptions={filters}
        onDropdown={setFilter}
        button={type === UserType.host ? 'New User' : 'New Chef'}
      />
      <PageTable
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
              <PageAction items={[]} onItemClick={onAction} />
            </th>
          </tr>
        }
        body={users.map((user) => {
          const isSelected = selected.includes(user.id);
          return (
            <tr
              key={user.id}
              className={isSelected ? 'active' : undefined}
              onClick={() => navigate(`/${type}s/${user.id}`)}
            >
              <td>
                <label>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={isSelected}
                    onClick={(event) => {
                      toggleSelection(user.id);
                      event.stopPropagation();
                    }}
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
                <PageAction
                  items={[
                    { title: 'Edit', icon: 'edit' },
                    ...(type == UserType.host
                      ? [{ title: 'Approve docs', icon: 'approve-document' }]
                      : []),
                    { title: user.is_active ? 'Suspend' : 'Activate', icon: 'suspend' },
                    { title: 'Delete', icon: 'delete' },
                    { title: 'Reset Password', icon: 'reset' },
                    ...(type == UserType.chef ? [{ title: 'Verification', icon: 'check' }] : [])
                  ]}
                  onItemClick={(action) => onAction(action, user)}
                />
              </td>
            </tr>
          );
        })}
        page={page}
        numberOfPages={numberOfPages}
        totalItemCount={totalCount}
        pageItemCount={users.length}
        onPageChange={setPage}
      />
      <ToggleUserActiveModal ref={suspendUserRef} type={type} user={selectedUser} />
    </>
  );
}
