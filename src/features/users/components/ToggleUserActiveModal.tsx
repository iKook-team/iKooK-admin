import { forwardRef, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { toast } from 'react-toastify';
import { User } from '../data/model.ts';
import { UserType } from '../domain/types.ts';
import { useToggleUserActive } from '../domain/usecase.ts';
import { getCurrentFromRef } from '../../../utils/ref.ts';

interface ToggleUserActiveModalProps {
  user?: User;
  type: UserType;
}

const ToggleUserActiveModal = forwardRef<HTMLDialogElement, ToggleUserActiveModalProps>(
  ({ user, type }, ref) => {
    const title = user?.is_active ? 'Suspend' : 'Activate';
    console.log(user)
    const [loading, setLoading] = useState(false);

    const mutation = useToggleUserActive(type);

    const onSubmit = async () => {
      if (loading || user === undefined) {
        return;
      }

      try {
        setLoading(true);

        const response = await mutation.mutateAsync({
          id: user!.id,
          disable: user?.is_active
        });
          console.log(response);
        toast(response.data.data, { type: 'success' });
        getCurrentFromRef(ref)?.close();
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
            {title}{' '}
            <span className="text-jordy-blue capitalize">
              {user?.first_name} {user?.last_name}
            </span>
            ?
          </>
        }
      >
        <p>Are you sure you want to do this?</p>
        <div className="flex flex-row gap-10 justify-end mt-4">
          <button className="btn-ghost" onClick={() => getCurrentFromRef(ref)?.close()}>
            Cancel
          </button>
          <button
            className={`btn btn-primary border-0 ${user?.is_active ? 'bg-red' : 'bg-green'}`}
            disabled={loading}
            onClick={onSubmit}
          >
            {title}
            {loading && <span className="loading loading-spinner"></span>}
          </button>
        </div>
      </PageModal>
    );
  }
);

ToggleUserActiveModal.displayName = 'SuspendUserModal';

export default ToggleUserActiveModal;
