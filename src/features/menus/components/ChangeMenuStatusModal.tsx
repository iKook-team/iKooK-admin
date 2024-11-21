import { FormEvent, forwardRef, useRef, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { Menu } from '../data/model.ts';
import InputField, { DropdownField } from '../../../app/components/InputField.tsx';
import { useUpdateMenuStatus } from '../domain/usecase.ts';
import { toast } from 'react-toastify';

interface ChangeMenuStatusModalProps {
  menu?: Menu;
}

const ChangeMenuStatusModal = forwardRef<HTMLDialogElement, ChangeMenuStatusModalProps>(
  ({ menu }, ref) => {
    const form = useRef<HTMLFormElement>(null);

    const mutation = useUpdateMenuStatus();

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>();
    const [reason, setReason] = useState<string>();

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!form.current?.checkValidity() || loading) {
        return;
      }

      try {
        setLoading(true);

        await mutation.mutateAsync({
          id: menu!.id,
          // @ts-expect-error status is either approve or unapprove
          status: status!,
          reason
        });
        toast(`${menu?.menuName} updated successfully`, { type: 'success' });
        ref?.current?.close();
        setStatus('approve');
        setReason(undefined);
      } finally {
        setLoading(false);
      }
    };

    return (
      <PageModal
        ref={ref}
        title={
          <>
            Update <span className="text-jordy-blue">{`Chef ${menu?.chefID.username}'s `}</span>
            <span className="text-purple-taupe">{menu?.menuName}</span> status
          </>
        }
      >
        <form ref={form} onSubmit={onSubmit}>
          <DropdownField
            value={status}
            label="Status"
            onChange={(event) => setStatus(event.target.value)}
            options={['approve', 'unapprove']}
            required={true}
          />
          {status === 'unapprove' && (
            <InputField
              value={reason}
              label="Reason"
              placeholder="Enter reason"
              required={true}
              onChange={(event) => setReason(event.target.value)}
              className="mt-4"
            />
          )}
          <button type="submit" className="btn btn-primary w-full mt-8" disabled={loading}>
            Update
            {loading && <span className="loading loading-spinner"></span>}
          </button>
        </form>
      </PageModal>
    );
  }
);

ChangeMenuStatusModal.displayName = 'ChangeMenuStatusModal';

export default ChangeMenuStatusModal;
