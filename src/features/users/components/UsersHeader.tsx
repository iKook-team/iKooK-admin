import { ReactNode, useMemo } from 'react';
import { UserType } from '../domain/types.ts';

interface UsersHeaderProps {
  leading?: ReactNode;
  children?: ReactNode;
  type: UserType;
}

export default function UsersHeader({ leading, children, type }: UsersHeaderProps) {
  const header = useMemo(
    () => [
      'Name',
      'Email',
      'Address',
      ...(type == UserType.host ? ['Phone No'] : ['Wallet', 'Rating']),
      'Status'
    ],
    [type]
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
