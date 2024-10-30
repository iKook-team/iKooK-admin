import { SetStateAction, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { bookingType } from '../users/domain/types';
import PageBackButton from '../../app/components/page/PageBackButton';
import PageTitle from '../../app/components/page/PageTitle';
import Constants from '../../utils/constants';
import { getImageUrl } from '../../utils/getImageUrl';
import { Booking } from './data/model';
import { DropdownField } from '../../app/components/InputField';
import PreferredCuisines from './components/PreferredCuisines';

export default function BookingEditScreen() {
  // const { pathname } = useLocation();
  const filters = useMemo(() => ['in-progress', 'rejected', 'successful'], []);

  const location = useLocation();
  const [type, userId] = useMemo(() => {
    const [type, userId] = location.pathname.split('/').slice(1);
    return [type.slice(0, 4) as bookingType, userId];
  }, [location.pathname]);

  // const { isPending, booking, error } = useFetchBookingQuery(type, userId);
  const booking = location.state?.booking as Booking;

  const iconTextList = [
    { icon: 'calender-check', text: 'date from api' },
    { icon: 'location-pin', text: `${booking.location}` },
    {
      icon: 'person-male-female',
      text: `${booking.number_of_guest ? booking.number_of_guest : 0} people`
    }
  ];

  const menuList = [
    { icon: 'carrot', text: 'All Ingredients' },
    { icon: 'car', text: "Chef's travel and insurance costs" },
    { icon: 'dish', text: 'Serving and Clean-up' },
    {
      icon: 'shield',
      text: 'Money Protection',
      extratext: 'We pay the chefs after the event, to protect your money'
    }
  ];

  const cuisines = [
    'African',
    'Italian',
    'Chinese',
    'European',
    'Modern English',
    'BBQ',
    'Indian',
    'Middle Eastern',
    'Spanish'
  ];

  const eventTypes = ['wedding'];

  const allergies = ['none'];

  const [filter, setFilter] = useState<string>(filters[0]);

  return (
    <>
      <PageBackButton />

      <div className="flex flex-row justify-between my-6 mr-20">
        <PageTitle title={type === bookingType.menu ? 'Chef at Home Booking' : 'Enquiry'} />
        <h2 className="underline">edit {type}</h2>
      </div>

      <div className="flex justify-between mr-20 ">
        <div className="flex flex-col">
          <div className="">
            <div className="flex border border-gray-300 shadow-lg py-2 px-1 gap-2">
              <img
                className="h-20 w-20 object-cover"
                src={`${Constants.userUrl}/${booking?.chef.photo}`}
                alt=""
              />
              <div className="flex flex-col ">
                <h1 className="capitalize font-bold">{`large event with chef ${booking.chef.firstName}`}</h1>

                <div className="flex gap-2">
                  <div className="flex gap-1">
                    <img
                      src={getImageUrl(`icons/ci_location.svg`)}
                      className=" text-primary"
                      alt=""
                    />
                    <h1>{booking.country}</h1>
                  </div>

                  <div className="flex gap-1">
                    <img src={getImageUrl(`icons/star.svg`)} alt="" />
                    <h1>4.6 (38 reviews)</h1>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex gap-1">
                    <img src={getImageUrl(`icons/cuisine.svg`)} className="text-primary" alt="" />
                    <h1>5 cuisines</h1>
                  </div>

                  <div className="flex gap-1">
                    <img src={getImageUrl(`icons/group.svg`)} alt="" />
                    <h1>40 + people</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-soft-cream flex mt-5 p-3 gap-2 w-[65%] ">
            <img src={getImageUrl(`icons/warning.svg`)} alt="" />
            <div className="flex flex-col">
              <h1 className="font-light">Your budget</h1>
              <h1 className="font-extrabold text-2xl">£1,435</h1>
            </div>
          </div>

          <PreferredCuisines cuisines={cuisines} eventTypes={eventTypes} allergies={allergies} />
        </div>
        <div className="flex flex-col aspect-[370/710] rounded-xl shadow-xl border border-gray-300 bg-white px-10 items-center">
          <button onClick={() => {}} className="btn btn-primary w-full h-min my-8 capitalize">
            quotes
          </button>
          <div className="flex flex-row gap-4 items-center mb-8 w-full">
            <img
              src={`${Constants.userUrl}/${booking?.user.photo}`}
              alt={booking?.user.firstName}
              className="w-8 h-8 aspect-square rounded-full"
            />
            <div className="flex flex-col">
              <span className="capitalize font-bold">
                {booking?.user.firstName + ' ' + booking?.user.lastName}
              </span>
              <span className="">{booking?.user.firstName + '@ikook.co.uk'}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 my-2 w-full">
            {iconTextList.map((each, index) => (
              <div key={index} className="flex gap-2 ">
                <img src={getImageUrl(`icons/${each.icon}.svg`)} alt="" />
                <h2>{each.text}</h2>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 my-5 w-full">
            <div className="flex justify-between">
              <h1> {booking.number_of_guest ? booking.number_of_guest : 0} Guests * £20</h1>
              <h1> £ {booking.number_of_guest * 20}</h1>
            </div>

            <div className="flex justify-between pb-5 border-b">
              <h1> platform fees 2.5%</h1>
              <h1> £ {booking.number_of_guest * 20 * 0.25}</h1>
            </div>

            <div className="flex justify-between">
              <h1 className="font-bold uppercase"> Total</h1>
              <h1> £ {booking.number_of_guest * 20 * 0.25 + booking.number_of_guest * 20}</h1>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <DropdownField
              value={filter}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setFilter(e.target.value)
              }
              options={filters}
            />
            <button onClick={() => {}} className="btn btn-outline w-full h-min capitalize">
              Cancel
            </button>

            <button onClick={() => {}} className="btn bg-black text-white w-full h-min capitalize">
              Delete
            </button>

            <div className="bg-yellow-50 p-3">
              <h1 className="capitalize mb-2 font-bold">the menu includes</h1>

              {menuList.map((menu, index) => (
                <div className="flex gap-3 p-2 " key={index}>
                  <div className="bg-primary h-5 rounded-xl w-5 items-center justify-center flex mt-1">
                    <img className="w-3 h-3" src={getImageUrl(`icons/${menu.icon}.svg`)} alt="" />
                  </div>
                  <div className="flex flex-col ">
                    <h1 className="bg">{menu.text}</h1>
                    {menu.extratext && <h1 className="text-xs">{menu.extratext}</h1>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
