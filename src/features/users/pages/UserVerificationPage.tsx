import { UserPageProps } from '../domain/types.ts';
import UserSettingsTitle from '../components/UserSettingsTitle.tsx';
import Constants from '../../../utils/constants.ts';
import close from '../../../app/assets/icons/close.svg';
import { ReactSVG } from 'react-svg';
import useBreakpoint from '../../../hooks/useBreakpoint.ts';
import { useLocation } from 'react-router-dom';
import { useToggleUserVerificationStatus } from '../domain/usecase.ts';
import { Ref, useRef, useState } from 'react';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import PageModal from '../../../app/components/page/PageModal.tsx';
import InputField from '../../../app/components/InputField.tsx';
import { toast } from 'react-toastify';
import { capitalize } from '../../../utils/strings.ts';
import StatusPill from '../components/StatusPill.tsx';
import ImageViewerModal from '../../../app/components/ImageViewerModal.tsx';

export default function UserVerificationPage({ user, type }: UserPageProps) {
  const { pathname } = useLocation();
  const mutation = useToggleUserVerificationStatus(type);

  const messageRef = useRef<HTMLDialogElement>(null);
  const typeRef = useRef<string | null>(null);

  const [loading, setLoading] = useState<UserVerificationLoading>();
  const [image, setImage] = useState<string>();

  const onAction = (type: string, action: boolean) => {
    if (action) {
      void onSubmit(action, type);
    } else {
      typeRef.current = type;
      getCurrentFromRef(messageRef)?.showModal();
    }
  };

  const onImage = (image?: string) => {
    setImage(image ? Constants.getAssetUrl(image, 'verification') : undefined);
  };

  const onSubmit = async (accept: boolean, type: string, message?: string) => {
    if (loading) {
      return;
    }
    try {
      setLoading({
        type,
        accept
      });
      await mutation.mutateAsync({ id: pathname.split('/').pop()!, accept, type, message });
      getCurrentFromRef(messageRef)?.close();
      toast(`${capitalize(type)} ${accept ? 'accepted' : 'rejected'} successfully`, {
        type: 'success'
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(undefined);
    }
  };

  return (
    <div>
      <UserSettingsTitle title="Verification" onSave={() => {}} />
      <div className="flex flex-col items-start justify-center mt-3.5 gap-9 w-full xl:w-[90%]">
        <DocumentEntry
          title="Identity Document"
          subtitle="Upload a Government ID. Accepted is either Drivers License or International Passport"
          status={user.verification?.identity?.status}
          image={user.verification?.document?.identity}
          onAction={(active) => onAction('identity', active)}
          onImage={() => onImage(user.verification?.document?.identity)}
          loading={loading?.type == 'identity' ? loading : undefined}
        />
        <DocumentEntry
          title="Certificate"
          subtitle="Upload your Culinary school certificate here"
          status={user.verification?.document?.status}
          image={user.verification?.document?.certificate}
          onAction={(active) => onAction('document', active)}
          onImage={() => onImage(user.verification?.document?.certificate)}
          loading={loading?.type == 'document' ? loading : undefined}
        />
      </div>
      <UserVerificationReasonModal
        ref={messageRef}
        onSave={(message) => onSubmit(false, typeRef.current!, message)}
      />
      {image && <ImageViewerModal src={image} onClose={() => setImage(undefined)} />}
    </div>
  );
}

function DocumentEntry(props: {
  title: string;
  subtitle: string;
  status?: string;
  image?: string;
  onAction: (active: boolean) => void;
  onImage: () => void;
  loading?: UserVerificationLoading;
}) {
  const DragAndDrop = (className: { className: string }) => (
    <div
      className={`rounded-lg place-content-center ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='rgb(50 51 53 / 0.3)' stroke-width='2' stroke-dasharray='14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`
      }}
    >
      <p className="text-center text-base md:text-lg font-medium text-dark-charcoal/40">
        Drag & Drop your Document (JPEG, PNG, PDF)
      </p>
      <p className="mt-2 text-center text-xs md:text-sm text-primary">Click here to select file</p>
    </div>
  );

  const isSmallScreen = useBreakpoint('sm').isBelowSm;

  return props.image ? (
    <div>
      <div className="flex flex-row gap-2 items-center">
        <h1 className="font-medium text-base">{props.title}</h1>
        <StatusPill
          status={props.status ?? ''}
          type={
            props.status === 'accepted'
              ? 'active'
              : props.status === 'rejected'
                ? 'inactive'
                : 'pending'
          }
        />
      </div>
      <p className="mt-2 font-medium text-xs text-dark-charcoal/50">{props.subtitle}</p>
      <div className="mt-4 h-64 flex flex-row justify-between items-stretch gap-5 md:gap-9">
        {!isSmallScreen && <DragAndDrop className="w-[55%]" />}
        <div className="basis-[25%] aspect-square relative">
          <img
            src={props.image && Constants.getAssetUrl(props.image, 'verification')}
            alt={props.title}
            className="rounded-lg"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
          <div className="absolute top-0 left-0 bg-dark-charcoal/50 h-full w-full rounded-lg" />
          <button className="absolute top-4 right-2 text-white">
            <ReactSVG src={close} className="w-6 h-6" />
          </button>
          <button
            className="absolute bottom-0 left-0 btn btn-primary rounded-b-lg rounded-t-none w-full text-black-base"
            onClick={props.onImage}
          >
            View Document
          </button>
        </div>
        <div className="flex flex-col gap-3 justify-center">
          <button
            className="btn btn-primary"
            disabled={props.loading?.accept === true}
            onClick={() => props.onAction(true)}
          >
            Accept
            {props.loading?.accept === true && <span className="loading loading-spinner"></span>}
          </button>
          <button
            className="btn btn-ghost bg-soft-cream text-yellow-500"
            disabled={props.loading?.accept === false}
            onClick={() => props.onAction(false)}
          >
            Reject
            {props.loading?.accept === false && <span className="loading loading-spinner"></span>}
          </button>
          {isSmallScreen && <DragAndDrop className="w-full" />}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

function UserVerificationReasonModal({
  onSave,
  ref
}: {
  onSave: (message: string) => void;
  ref: Ref<HTMLDialogElement>;
}) {
  const [reason, setReason] = useState('');
  return (
    <PageModal ref={ref} id="user-verification-reason-modal" title={'Reason'}>
      <InputField
        value={reason}
        placeholder="Enter reason"
        onChange={(event) => setReason(event.target.value)}
      />
      <div className="flex flex-row gap-10 justify-end mt-4">
        <button className="btn-ghost" onClick={() => getCurrentFromRef(ref)?.close()}>
          Cancel
        </button>
        <button
          className="btn btn-primary border-none bg-red-base"
          onClick={() => {
            if (!reason) {
              toast('Please enter a reason', { type: 'error' });
              return;
            }
            onSave('message');
            getCurrentFromRef(ref)?.close();
          }}
        >
          Save
        </button>
      </div>
    </PageModal>
  );
}

type UserVerificationLoading = {
  type: string;
  accept: boolean;
};
