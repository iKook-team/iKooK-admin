import { AddonType } from '../domain/type.ts';
import { useMemo } from 'react';

interface AddonsHeaderProps {
  type: AddonType;
}

export default function AddonsHeader({ type }: AddonsHeaderProps) {
  const header = useMemo(
    () =>
      type === AddonType.service
        ? ['Client', 'Item', 'Price (per person)', 'Status']
        : ['Name', 'Business Name', 'Address', 'Phone No', 'Status'],
    [type]
  );
  return (
    <tr>
      {header.map((title) => (
        <th key={title} className="text-left">
          {title}
        </th>
      ))}
    </tr>
  );
}
