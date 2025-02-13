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

  const menuEmpty = starterList.length === 0 && mainList.length === 0 && dessertList.length === 0;

  return (
    <div className="flex flex-col gap-3">
      {starterList.length > 0 && (
        <div>
          <h1 className="capitalize font-semibold">starter</h1>

          <DropdownField
            value={starter}
            onChange={(e) => setStarter!(e.target.value)}
            options={starterList}
          />
        </div>
      )}
      {mainList.length > 0 && (
        <div>
          <h1 className="capitalize font-semibold">main</h1>

          <DropdownField
            value={main}
            onChange={(e) => setMain(e.target.value)}
            options={mainList}
          />
        </div>
      )}
      {dessertList.length > 0 && (
        <div>
          <h1 className="capitalize font-semibold">dessert</h1>

          <DropdownField
            value={dessert}
            onChange={(e) => setDessert(e.target.value)}
            options={dessertList}
          />
        </div>
      )}

      {menuEmpty && <h1>No menu to </h1> }

     { !menuEmpty  && <button onClick={() => {}} className="btn btn-primary flex mx-auto mt-3 w-32">
        Update
      </button>}
    </div>
  );
};

export default EditMenuModalContent;
