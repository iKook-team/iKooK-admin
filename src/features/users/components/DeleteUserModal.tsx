import { Ref, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { toast } from 'react-toastify';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import { useDeleteAccount } from '../domain/usecase.ts';
import { User } from '../data/model.ts';
import { UserType } from '../domain/types.ts';

interface DeleteAccountModalProps {
  user?: User;
  ref: Ref<HTMLDialogElement>;
  usertype : UserType;
}

export default function DeleteUserModal({ user, ref , usertype}: DeleteAccountModalProps) {
  const title = 'Delete Account for ';

  const [loading, setLoading] = useState(false);

  const mutation = useDeleteAccount(usertype);

  const onSubmit = async () => {
    if (loading || user === undefined) {
      return;
    }

    try {
      setLoading(true);

      const response = await mutation.mutateAsync({
        id: user.id
      });

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
          {title + " " + usertype + " "}
          <span className="text-jordy-blue capitalize">
            {user?.first_name} {user?.last_name}
          </span>
          ?
        </>
      }
    >
      <>
        <h1>Are you sure you want to delete this {usertype}?</h1>
        <div className="flex  gap-4 justify-center">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="btn btn-soft-cream flex border border-primary  mt-3 w-[40%] "
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={() => getCurrentFromRef(ref)?.close()}
            className="btn btn-primary flex  mt-3 w-[40%]"
          >
            Cancel
          </button>
        </div>
      </>
    </PageModal>
  );
}
