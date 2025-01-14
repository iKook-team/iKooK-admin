import { FormEvent, Ref, useRef, useState, useTransition } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { Menu } from '../data/model.ts';
import InputField, { DropdownField } from '../../../app/components/InputField.tsx';
import { useUpdateMenuStatus } from '../domain/usecase.ts';
import { toast } from 'react-toastify';
import { getCurrentFromRef } from '../../../utils/ref.ts';

export default function ChangeMenuStatusModal({ menu, ref }: ChangeMenuStatusModalProps) {
  const form = useRef<HTMLFormElement>(null);

  const mutation = useUpdateMenuStatus();
  const [state, setState] = useState<ChangeMenuStatusModalState>(initialState);
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.current?.checkValidity() || isPending) {
      return;
    }

    startTransition(async () => {
      await mutation.mutateAsync({
        id: menu!.id,
        ...state
      });
      toast(`${menu?.menuName} updated successfully`, { type: 'success' });
      getCurrentFromRef(ref)?.close();
      setState(initialState);
    });
  };

  return (
    <PageModal
      ref={ref}
      id="change-menu-status-modal"
      title={
        <>
          Update <span className="text-jordy-blue">{`Chef ${menu?.chefID.username}'s `}</span>
          <span className="text-purple-taupe">{menu?.menuName}</span> status
        </>
      }
    >
      <form ref={form} onSubmit={onSubmit}>
        <DropdownField
          value={state.status}
          label="Status"
          onChange={(event) =>
            setState((prevState) => ({
              ...prevState,
              status: event.target.value as ChangeMenuStatus
            }))
          }
          options={['approve', 'unapprove']}
          required={true}
        />
        {state.status === 'unapprove' && (
          <InputField
            value={state.reason}
            label="Reason"
            placeholder="Enter reason"
            required={true}
            onChange={(event) =>
              setState((prevState) => ({ ...prevState, reason: event.target.value }))
            }
            className="mt-4"
          />
        )}
        <button type="submit" className="btn btn-primary w-full mt-8" disabled={isPending}>
          Update
          {isPending && <span className="loading loading-spinner"></span>}
        </button>
      </form>
    </PageModal>
  );
}

type ChangeMenuStatusModalProps = {
  menu?: Menu;
  ref: Ref<HTMLDialogElement>;
};

type ChangeMenuStatus = 'approve' | 'unapprove';

type ChangeMenuStatusModalState = {
  status: ChangeMenuStatus;
  reason: string;
};

const initialState: ChangeMenuStatusModalState = {
  status: 'approve',
  reason: ''
};
