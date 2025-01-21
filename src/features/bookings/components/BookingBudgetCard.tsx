import React from 'react';
import PreferredCuisines from './PreferredCuisines';
import { getImageUrl } from '../../../utils/getImageUrl';
import { Menu, QuoteMenu } from '../data/model';

interface BudgetCardProps {
  message : string;
  budget : number;
  cuisines: string[];
  eventType: string;
  allergies: string[];
}

interface MenuListProps {
  starterList: Menu[];
  mainList: Menu[];
  dessertList: Menu[];
}

interface QuoteMenuListProps {
  starterList: QuoteMenu[];
  mainList: QuoteMenu[];
  dessertList: QuoteMenu[];
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget,  cuisines, eventType, allergies , message}) => {

  return (
    <div>
      <div className="bg-soft-cream flex mt-5 p-3 gap-2 w-[70%]">
        <img src={getImageUrl("icons/warning.svg")} alt="Warning Icon" />
        <div className="flex flex-col">
          <h1 className="font-light">Your budget</h1>
          <h1 className="font-extrabold text-2xl">NGN {budget}</h1>
        </div>
      </div>

      <PreferredCuisines cuisines={cuisines} eventType={eventType} allergies={allergies} message={message} />
    </div>
  );
};

export default BudgetCard;

export const MenuList: React.FC<MenuListProps> = ({ starterList, mainList, dessertList }) => {
  return (
    <div className="bg-soft-cream w-[80%] mt-10 p-3 ">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className='font-bold'>Starter x { starterList ? starterList.length : 0 }</h1>
          <div className="flex flex-col gap-2 mt-4">
            {starterList?.map((starter, index) => (
              <div className="flex gap-2 justify-start items-center" key={index}>
                <input
                  type="checkbox"
                  className=" accent-white  w-5 h-5 bg-white border-2 border-primary checked:bg-white checked:border-yellow-500 checked:text-yellow-500  focus:outline-none"
                />
                <h1 className='font-light'>{starter.menuName}</h1>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className='font-bold'>Main x { mainList ? mainList?.length : 0}</h1>

          <div className="flex flex-col gap-2 mt-4">
            {mainList?.map((main) => (
              <div className="flex gap-2 justify-start items-center">
                <input
                  type="checkbox"
                  className=" accent-white  w-5 h-5 bg-white border-2 border-primary checked:bg-white checked:border-yellow-500 checked:text-yellow-500  focus:outline-none"
                />
                <h1 className='font-light'>{main.menuName}</h1>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className='font-bold'>Dessert x { dessertList ? dessertList?.length : 0}</h1>

          <div className="flex flex-col gap-2 mt-4">
            {dessertList?.map((dessert) => (
              <div className="flex gap-2 justify-start items-center">
                <input
                  type="checkbox"
                  className=" accent-white  w-5 h-5 bg-white border-2 border-primary checked:bg-white checked:border-yellow-500 checked:text-yellow-500  focus:outline-none"
                />
                <h1 className='font-light'>{dessert.menuName}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



export const QuoteMenuList: React.FC<QuoteMenuListProps> = ({ starterList, mainList, dessertList }) => {
  return (
    <div className="bg-soft-cream w-[80%] mt-10 p-3 ">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className='font-bold'>Starter x { starterList ? starterList.length : 0 }</h1>
          <div className="flex flex-col gap-2 mt-4">
            {starterList?.map((starter, index) => (
              <div className="flex gap-2 justify-start items-center" key={index}>
                <input
                  type="checkbox"
                  className=" accent-white  w-5 h-5 bg-white border-2 border-primary checked:bg-white checked:border-yellow-500 checked:text-yellow-500  focus:outline-none"
                />
                <h1 className='font-light'>{starter.menu_name}</h1>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className='font-bold'>Main x { mainList ? mainList?.length : 0}</h1>

          <div className="flex flex-col gap-2 mt-4">
            {mainList?.map((main) => (
              <div className="flex gap-2 justify-start items-center">
                <input
                  type="checkbox"
                  className=" accent-white  w-5 h-5 bg-white border-2 border-primary checked:bg-white checked:border-yellow-500 checked:text-yellow-500  focus:outline-none"
                />
                <h1 className='font-light'>{main.menu_name}</h1>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className='font-bold'>Dessert x { dessertList ? dessertList?.length : 0}</h1>

          <div className="flex flex-col gap-2 mt-4">
            {dessertList?.map((dessert) => (
              <div className="flex gap-2 justify-start items-center">
                <input
                  type="checkbox"
                  className=" accent-white  w-5 h-5 bg-white border-2 border-primary checked:bg-white checked:border-yellow-500 checked:text-yellow-500  focus:outline-none"
                />
                <h1 className='font-light'>{dessert.menu_name}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
