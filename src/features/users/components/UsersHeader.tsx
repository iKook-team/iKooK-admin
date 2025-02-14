import { ReactNode, useMemo } from 'react';
import { UserType } from '../domain/types.ts';

interface UsersHeaderProps {
  leading?: ReactNode;
  children?: ReactNode;
  type: UserType;
  isServices?: boolean;
}

export default function UsersHeader({ leading, children, type, isServices }: UsersHeaderProps) {
  const header = useMemo(
    () => [
      'Name',
      'Email',
      ...(type !== UserType.admin ? ['Address'] : []),
      ...(type !== UserType.chef ? ['Phone No'] : isServices ? ['Rating'] : ['Wallet', 'Rating']),
      ...(type === UserType.admin ? ['Role'] : []),
      'Status'
    ],
    [type, isServices]
  );

  return (
    <tr>
      {leading}
      {header.map((title) => (
        <th key={title} className="text-left">
          {title}
        </th>
      ))}
      {children}
    </tr>
  );
}
