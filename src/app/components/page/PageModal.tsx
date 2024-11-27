import { forwardRef, ReactNode } from 'react';
import close from '../../assets/icons/close.svg';
import { ReactSVG } from 'react-svg';

interface PageModalProps {
  id: string;
  title: ReactNode;
  children: ReactNode;
}

const PageModal = forwardRef<HTMLDialogElement, PageModalProps>((props, ref) => {
  return (
    <dialog id={props.id} ref={ref} className="modal">
      <div className="modal-box pt-9 px-11 pb-11">
        <div className="flex flex-row gap-2 mb-6">
          <h1 className="flex-1 text-2xl font-semibold capitalize">{props.title}</h1>
          <form method="dialog">
            <button>
              <ReactSVG src={close} className="w-6 h-6" />
            </button>
          </form>
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
