import { forwardRef, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { toast } from 'react-toastify';
import { User } from '../data/model.ts';
import { UserType } from '../domain/types.ts';
import { useSuspendUser } from '../domain/usecase.ts';

interface SuspendUserModalProps {
  user?: User;
  type: UserType;
}

const SuspendUserModal = forwardRef<HTMLDialogElement, SuspendUserModalProps>(
  ({ user, type }, ref) => {
    const [loading, setLoading] = useState(false);

    const mutation = useSuspendUser(type);

    const onSubmit = async () => {
      if (loading || user === undefined) {
        return;
      }

      try {
        setLoading(true);

        await mutation.mutateAsync(user!.id);

        toast(`${user?.username} suspended successfully`, { type: 'success' });
        ref?.current?.close();
      } finally {
        setLoading(false);
      }
    };

    return (
      <PageModal
        ref={ref}
        id="suspend-user-modal"
        title={
          <>
            Suspend{' '}
            <span className="text-jordy-blue capitalize">
              {user?.first_name} {user?.last_name}
            </span>
            ?
          </>
        }
      >
        <p>This action cannot be undone</p>
        <div className="flex flex-row gap-10 justify-end mt-4">
          <button className="btn-ghost" onClick={() => ref?.current?.close()}>
            Cancel
          </button>
          <button className="btn btn-primary bg-red" disabled={loading} onClick={onSubmit}>
            Suspend
            {loading && <span className="loading loading-spinner"></span>}
          </button>
        </div>
      </PageModal>
    );
  }
);

SuspendUserModal.displayName = 'SuspendUserModal';

export default SuspendUserModal;
