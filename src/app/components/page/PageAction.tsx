import { getImageUrl } from '../../../utils/getImageUrl.ts';
import { PageActionItem } from './types.ts';
import { MouseEventHandler, useState } from 'react';
import Dropdown from '../Dropdown.tsx';
import { MdOutlineMoreHoriz } from 'react-icons/md';

interface PageActionProps {
  items: PageActionItem[];
  onItemClick?: (item: PageActionItem) => void;
}

export default function PageAction({ items, onItemClick }: PageActionProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const openDropdown: MouseEventHandler<SVGElement> = (event) => {
    setDropdownOpen((prev) => !prev);
    event.stopPropagation();
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <Dropdown
      visible={dropdownOpen}
      onDismiss={closeDropdown}
      actionButton={<MdOutlineMoreHoriz role="button" onClick={openDropdown} />}
    >
      {items.map((item) => (
        <ActionItem
          key={item.title}
          icon={item.icon}
          text={item.title}
          onClick={() => {
            onItemClick?.(item);
            closeDropdown();
          }}
        />
      ))}
    </Dropdown>
  );
}

function ActionItem(props: { icon: string; text: string; onClick: () => void }) {
  return (
    <li>
      <button
        className="flex flex-row items-center gap-2"
        onClick={(event) => {
          props.onClick();
          event.stopPropagation();
        }}
      >
        <img src={getImageUrl(`icons/${props.icon}.svg`)} alt={props.text} />
        <span>{props.text}</span>
      </button>
    </li>
  );
}
