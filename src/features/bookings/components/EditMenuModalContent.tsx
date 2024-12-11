import React, { useMemo, useState } from 'react';
import { DropdownField } from '../../../app/components/InputField';

type MenuProps = {
  starter: string[];
  main: string[];
  dessert: string[];
  //   all : [starter[] ]
};

const EditMenuModalContent: React.FC<MenuProps> = ({ starter, main, dessert }) => {
  const filters = useMemo(() => ['in-progress', 'rejected', 'successful'], []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setFilter] = useState<string>(filters[0]);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="capitalize font-semibold">starter</h1>
      {starter.map((e) => (
        <div>
          <DropdownField
            value={e.toString()}
            onChange={(e) => setFilter!(e.target.value)}
            options={filters!}
          />
        </div>
      ))}
      <h1 className="capitalize font-semibold">main</h1>
      {main.map((e) => (
        <div>
          <DropdownField
            value={e.toString()}
            onChange={(e) => setFilter!(e.target.value)}
            options={filters!}
          />
        </div>
      ))}
      <h1 className="capitalize font-semibold">dessert</h1>
      {dessert.map((e) => (
        <div>
          <DropdownField
            value={e.toString()}
            onChange={(e) => setFilter!(e.target.value)}
            options={filters!}
          />
        </div>
      ))}

      <button onClick={() => {}} className="btn btn-primary flex mx-auto mt-3 w-32">
        Update
      </button>
    </div>
  );
};

export default EditMenuModalContent;
