import { Ref } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import InputField from '../../../app/components/InputField.tsx';
import { FaSearch } from 'react-icons/fa';
import PageTable from '../../../app/components/page/PageTable.tsx';
import { useFetchUsersQuery } from '../domain/usecase.ts';
import { UserType } from '../domain/types.ts';
import UsersHeader from './UsersHeader.tsx';
import UserRow from './UserRow.tsx';
import { User } from '../data/model.ts';

interface SearchUsersModalProps {
  ref: Ref<HTMLDialogElement>;
  onUserSelected: (user: User) => void;
  type: UserType;
}

export default function SearchUsersModal({ ref, onUserSelected, type }: SearchUsersModalProps) {
  const { isPending, error, users, query, setQuery, totalCount, page, setPage, numberOfPages } =
    useFetchUsersQuery({
      type
    });

  const isHost = type === UserType.host;

  return (
    <PageModal
      ref={ref}
      id="search-users-modal"
      title={`Select ${isHost ? 'Host' : 'Chef'}`}
      className="lg:min-w-[50rem]"
    >
      <InputField
        className="w-full mb-6"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search by name of ${isHost ? 'host' : 'chef'}`}
        trailing={<FaSearch />}
      />
      <PageTable
        isFetching={isPending}
        emptyMessage={
          error?.message ||
          (users.length == 0 ? (isHost ? 'No users found' : 'No chefs found') : undefined)
        }
        header={<UsersHeader type={type} />}
        body={users.map((user) => {
          return (
            <UserRow key={user.id} {...user} type={type} onClick={() => onUserSelected(user)} />
          );
        })}
        page={page}
        numberOfPages={numberOfPages}
        totalItemCount={totalCount}
        pageItemCount={users.length}
        onPageChange={setPage}
      />
    </PageModal>
  );
}
