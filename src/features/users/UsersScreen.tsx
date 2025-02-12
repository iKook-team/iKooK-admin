import { UserType } from './domain/types.ts';
import PageTable from '../../app/components/page/PageTable.tsx';
import { ChangeEventHandler, useRef, useState } from 'react';
import { useFetchUsersQuery } from './domain/usecase.ts';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../app/components/page/PageTitle.tsx';
import PageSearchRow from '../../app/components/page/PageSearchRow.tsx';
import PageAction from '../../app/components/page/PageAction.tsx';
import { PageActionItem } from '../../app/components/page/types.ts';
import ToggleUserActiveModal from './components/ToggleUserActiveModal.tsx';
import { User } from './data/model.ts';
import DeleteUserModal from './components/DeleteUserModal.tsx';
import ResetUserModal from './components/ResetUserPassword.tsx';
import UsersHeader from './components/UsersHeader.tsx';
import UserRow from './components/UserRow.tsx';
import Pills from '../../app/components/Pills.tsx';
import { fromKebabCase } from '../../utils/strings.ts';

type UsersScreenProps = {
  type: UserType;
  isServices?: boolean;
};

export default function UsersScreen({ type, isServices }: UsersScreenProps) {
  const navigate = useNavigate();

  const suspendUserRef = useRef<HTMLDialogElement>(null);
  const deleteUserRef = useRef<HTMLDialogElement>(null);
  const resetPasswordRef = useRef<HTMLDialogElement>(null);

  const [selected, setSelected] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();

  const {
    isPending,
    error,
    users,
    filter,
    setFilter,
    filters,
    service,
    setService,
    services,
    query,
    setQuery,
    totalCount,
    page,
    setPage,
    numberOfPages
  } = useFetchUsersQuery({
    type,
    includeServices: isServices
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

  const onAction = (action: PageActionItem, user?: User) => {
    setSelectedUser(user);
    switch (action.icon) {
      case 'suspend':
        suspendUserRef.current?.showModal();
        break;
      case 'edit':
        navigate(`/${type}s/${user!.id}`);
        break;
      case 'delete':
        deleteUserRef.current?.showModal();
        break;
      case 'reset':
        resetPasswordRef.current?.showModal();
        break;
      case 'check':
        console.log("for verification")
        break;
    }
  };

  return (
    <>
      <PageTitle title={isServices ? 'Services' : type === UserType.host ? 'Users' : 'Chefs'} />
      {isServices && (
        <Pills
          items={services}
          active={service}
          setActive={setService}
          getLabel={(value) => fromKebabCase(value) ?? value ?? ''}
        />
      )}
      <PageSearchRow
        className="mt-4 mb-6 w-full"
        search={query}
        onSearch={setQuery}
        dropdown={filter}
        dropdownOptions={filters}
        onDropdown={setFilter}
        button={isServices ? undefined : type === UserType.host ? 'New User' : 'New Chef'}
        onButton={isServices ? undefined : () => navigate(`/${type}s/new`)}
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
          <UsersHeader
            type={type}
            isServices={isServices}
            leading={
              <th>
                <label>
                  <input className="checkbox" type="checkbox" onChange={selectAll} />
                </label>
              </th>
            }
          >
            <th>
              <PageAction items={[]} onItemClick={onAction} />
            </th>
          </UsersHeader>
        }
        body={users.map((user) => {
          const isSelected = selected.includes(user.id);
          return (
            <UserRow
              key={user.id}
              {...user}
              type={type}
              isSelected={isSelected}
              isServices={isServices}
              onClick={() => navigate(`/${type}s/${user.id}`)}
              leading={
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
              }
            >
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
            </UserRow>
          );
        })}
        page={page}
        numberOfPages={numberOfPages}
        totalItemCount={totalCount}
        pageItemCount={users.length}
        onPageChange={setPage}
      />
      <ToggleUserActiveModal ref={suspendUserRef} type={type} user={selectedUser} />
      <ResetUserModal ref={resetPasswordRef} user={selectedUser} usertype={type} />
      <DeleteUserModal ref={deleteUserRef} user={selectedUser} usertype={type} />
    </>
  );
}
