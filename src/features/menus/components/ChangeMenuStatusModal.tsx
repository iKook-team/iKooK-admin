import { forwardRef } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { Menu } from '../data/model.ts';

interface ChangeMenuStatusModalProps {
  menu: Menu;
}

const ChangeMenuStatusModal = forwardRef<HTMLDialogElement, ChangeMenuStatusModalProps>(
  ({ menu }, ref) => {
    return (
      <PageModal ref={ref} title={`Update chef ${menu.chefID.username}'s ${menu.menuName} status`}>
        <p>Hello World</p>
      </PageModal>
    );
  }
);

ChangeMenuStatusModal.displayName = 'ChangeMenuStatusModal';

export default ChangeMenuStatusModal;
