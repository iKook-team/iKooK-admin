import { ReactNode, useMemo } from 'react';

interface MenuHeaderProps {
  children?: ReactNode;
}

export default function MenuHeader({ children }: MenuHeaderProps) {
  const header = useMemo(
    () => ['ID', 'Menu', 'Chef', 'Availability', 'Starting Price', 'Status'],
    []
  );

  return (
    <tr>
      {header.map((title) => (
        <th key={title} className="text-left">
          {title}
        </th>
      ))}
      {children}
    </tr>
  );
}
