import { FormEvent, Ref, useRef, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import InputField, { DropdownField } from '../../../app/components/InputField.tsx';
import { useUpdateMenu } from '../domain/usecase.ts';
import { toast } from 'react-toastify';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import { LoadingSpinner } from '../../../app/components/LoadingSpinner.tsx';
import { Menu, MenuStatus } from '../data/model.ts';

type ChangeMenuStatusModalProps = {
  menu?: Menu;
  ref: Ref<HTMLDialogElement>;
  initialState?: ChangeMenuStatusModalState;
  onDone?: () => void;
};

type ChangeMenuStatusModalState = {
  status: MenuStatus;
  reason: string;
};

export default function ChangeMenuStatusModal({
  menu,
  ref,
  initialState = {
    status: MenuStatus.active,
    reason: ''
  },
  onDone
}: ChangeMenuStatusModalProps) {
  const form = useRef<HTMLFormElement>(null);

  const mutation = useUpdateMenu();
  const [state, setState] = useState<ChangeMenuStatusModalState>(initialState);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.current?.checkValidity() || mutation.isPending) {
      return;
    }

    await mutation.mutateAsync({
      id: menu!.id,
      data: {
        status: state.status
      }
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
          Update <span className="text-jordy-blue">{`Chef ${menu?.chef?.first_name}'s `}</span>
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
              status: event.target.value as MenuStatus
            }))
          }
          options={[MenuStatus.active, MenuStatus.pending]}
          required={true}
        />
        {state.status === MenuStatus.pending && (
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
