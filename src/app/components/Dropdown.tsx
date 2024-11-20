import { ReactNode, useEffect, useRef } from 'react';

interface DropdownProps {
  visible: boolean;
  children?: ReactNode;
  onDismiss: () => void;
  actionButton?: ReactNode;
}

export default function Dropdown({ visible, actionButton, children, onDismiss }: DropdownProps) {
  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      onDismiss();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {actionButton}
      {visible ? (
        <ul
          className="absolute right-0 w-52 p-2 scale-100 dropdown-content menu bg-base-100 rounded-box z-[1] shadow mt-2 border border-gray-300"
          ref={dropdownRef}
        >
          {children}
        </ul>
      ) : (
        <></>
      )}
    </>
  );
}
