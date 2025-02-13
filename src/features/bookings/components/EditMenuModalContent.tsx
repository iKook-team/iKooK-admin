import React, { useState } from 'react';
import { DropdownField } from '../../../app/components/InputField';

type MenuProps = {
  starterList: string[];
  mainList: string[];
  dessertList: string[];
};

const EditMenuModalContent: React.FC<MenuProps> = ({ starterList, mainList, dessertList }) => {

  const [starter, setStarter] = useState('');
  const [main, setMain] = useState('');
  const [dessert, setDessert] = useState('');

  return (
    <div className="flex flex-col gap-3">
      <h1 className="capitalize font-semibold">starter</h1>
      <div>
        <DropdownField
          value={starter}
          onChange={(e) => setStarter!(e.target.value)}
          options={starterList}
        />
      </div>
      <h1 className="capitalize font-semibold">main</h1>
      <div>
        <DropdownField
          value={main}
          onChange={(e) => setMain(e.target.value)}
          options={mainList}
        />
      </div>
      <h1 className="capitalize font-semibold">dessert</h1>
      <div>
        <DropdownField
          value={dessert}
          onChange={(e) => setDessert(e.target.value)}
          options={dessertList}
        />
      </div>

      <button onClick={() => {}} className="btn btn-primary flex mx-auto mt-3 w-32">
        Update
      </button>
    </div>
  );
};

export default EditMenuModalContent;
