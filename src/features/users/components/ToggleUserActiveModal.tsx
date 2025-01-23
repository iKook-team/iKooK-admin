import { Ref, useTransition } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { toast } from 'react-toastify';
import { User } from '../data/model.ts';
import { UserType } from '../domain/types.ts';
import { useToggleUserActive } from '../domain/usecase.ts';
import { getCurrentFromRef } from '../../../utils/ref.ts';

interface ToggleUserActiveModalProps {
  user?: User;
  type: UserType;
  ref: Ref<HTMLDialogElement>;
}

export default function ToggleUserActiveModal({ user, type, ref }: ToggleUserActiveModalProps) {
  const title = user?.is_active ? 'Suspend' : 'Activate';
  const [isPending, startTransition] = useTransition();

  const mutation = useToggleUserActive(type);

  const onSubmit = async () => {
    if (isPending || user === undefined) {
      return;
    }

    startTransition(async () => {
      const response = await mutation.mutateAsync({
        id: user!.id,
        disable: user?.is_active
      });
      toast(response.data.data, { type: 'success' });
      getCurrentFromRef(ref)?.close();
    });
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
          className={`btn btn-primary border-0 ${user?.is_active ? 'bg-red-base' : 'bg-green'}`}
          disabled={isPending}
          onClick={onSubmit}
        >
          {title}
          {isPending && <span className="loading loading-spinner"></span>}
        </button>
      </div>
    </PageModal>
  );
}
