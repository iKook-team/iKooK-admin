import { forwardRef, ReactNode } from 'react';

interface PageModalProps {
  title: string;
  children: ReactNode;
}

const PageModal = forwardRef<HTMLDialogElement, PageModalProps>((props, ref) => {
  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box pt-9 px-11 pb-11">
        <div>
          <h1 className="text-2xl font-semibold">{props.title}</h1>
        </div>
        {props.children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

PageModal.displayName = 'PageModal';

export default PageModal;
