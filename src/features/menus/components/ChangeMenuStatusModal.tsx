import { FormEvent, Ref, useRef, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import InputField, { DropdownField } from '../../../app/components/InputField.tsx';
import { useUpdateMenuStatus } from '../domain/usecase.ts';
import { toast } from 'react-toastify';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import { LoadingSpinner } from '../../../app/components/LoadingSpinner.tsx';

type ChangeMenuStatusModalProps = {
  menu?: {
    name: string;
    id: string;
    chefUsername: string;
  };
  ref: Ref<HTMLDialogElement>;
  initialState?: ChangeMenuStatusModalState;
  onDone?: () => void;
};

type ChangeMenuStatus = 'approve' | 'unapprove';

type ChangeMenuStatusModalState = {
  status: ChangeMenuStatus;
  reason: string;
};

export default function ChangeMenuStatusModal({
  menu,
  ref,
  initialState = {
    status: 'approve',
    reason: ''
  },
  onDone
}: ChangeMenuStatusModalProps) {
  const form = useRef<HTMLFormElement>(null);

  const mutation = useUpdateMenuStatus();
  const [state, setState] = useState<ChangeMenuStatusModalState>(initialState);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.current?.checkValidity() || mutation.isPending) {
      return;
    }

    await mutation.mutateAsync({
      menuId: menu!.id,
      status: state.status,
      message: state.reason
    });
    toast(`${menu?.name} updated successfully`, { type: 'success' });
    getCurrentFromRef(ref)?.close();
    setState(initialState);
    onDone?.();
  };

  return (
    <PageModal
      ref={ref}
      id="change-menu-status-modal"
      title={
        <>
          Update <span className="text-jordy-blue">{`Chef ${menu?.chefUsername}'s `}</span>
          <span className="text-purple-taupe">{menu?.name}</span> status
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
        <button type="submit" className="btn btn-primary w-full mt-8" disabled={mutation.isPending}>
          <LoadingSpinner isLoading={mutation.isPending}>Update</LoadingSpinner>
        </button>
      </form>
    </PageModal>
  );
}
