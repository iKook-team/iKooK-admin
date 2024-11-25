import Constants from "../../../utils/constants";
import { getImageUrl } from "../../../utils/getImageUrl";
import { Booking } from "../data/model";

type RowListProps = {
  title: string;
  list: string[];
};

type ListTileProps = {
    title : string;
    subtitle : string;
}
type EnquiryProfileProps = {
  icon : string;
  text : string ;
  review : string | null;
}
 
type EnquiryProfileListTileProps = {
  booking : Booking;
  enquiryProfileList : EnquiryProfileProps[];
  enquiryProfileList1 : EnquiryProfileProps[];
}

export function RowList({ title, list }: RowListProps): JSX.Element {
  return (
    <div className="w-[65%]">
      <h1 className="font-extrabold text-2xl">{title}</h1>
      <div className="flex flex-wrap gap-3 h-max my-2">
        {list.map((each, index) => (
          <div
            key={index}
            className="flex bg-soft-cream items-center justify-center p-2 rounded-3xl border border-hard-cream h-min whitespace-nowrap font-medium capitalize"
          >
            {each}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListTile({title, subtitle} : ListTileProps) : JSX.Element {
  return (
    <div className="flex flex-col gap-1 ">
      <h1 className="font-extrabold text-2xl">{title}</h1>
      <h1>{subtitle}</h1>
    </div>
  );
}


export function EnquiryChefProfile({icon, text , review} : EnquiryProfileProps) : JSX.Element {
  return (
     <div className="flex gap-1 items-center">
      <img
        src={getImageUrl(`icons/${icon}.svg`)}
        className="h-[14px] w-[14px]"
        alt=""
      />
      <h1>{text}</h1>
{    review &&  <h1>{review}</h1>}
    </div>
  )
}



export function EnquiryProfileListTile({booking , enquiryProfileList , enquiryProfileList1} : EnquiryProfileListTileProps) : JSX.Element{
  return (
    <div className="w-[80%]">
            <div className="flex border border-gray-300 shadow-lg py-2 px-1 gap-2">
              <img
                className="h-20 w-20 object-cover"
                src={`${Constants.userUrl}/${booking?.chef?.photo}`}
                alt=""
              />
              <div className="flex flex-col ">
                <h1 className="capitalize font-bold mb-2">{`large event with chef ${booking?.chef?.first_name}`}</h1>


               <div className='flex gap-2'>
               {enquiryProfileList.map((each, index) => (
                  <EnquiryChefProfile key={index} icon={each.icon} text={each.text} review={each.review} />
                ))}
               </div>

               <div className='flex gap-2'>
               {enquiryProfileList1.map((each, index) => (
                  <EnquiryChefProfile key={index} icon={each.icon} text={each.text} review={each.review} />
                ))}
               </div>
              </div>
            </div>
          </div>
  )
}

export function MenuProfileListTile({booking , enquiryProfileList } : EnquiryProfileListTileProps) : JSX.Element{
  return (
    <div className="w-[80%]">
            <div className="flex border border-gray-300 shadow-lg py-2 px-1 gap-2">
              <img
                className="h-20 w-20 object-cover"
                src={`${Constants.userUrl}/${booking?.chef?.photo}`}
                alt=""
              />
              <div className="flex flex-col">
                <h1 className="capitalize font-bold mb-2">{`Braised chicken with Lemons and Olives `}</h1>
               
               <h1 className="capitalize"> chef {booking.chef?.first_name + " " + booking.chef?.last_name}</h1>

            

               <div className='flex gap-2'>
               {enquiryProfileList.map((each, index) => (
                  <EnquiryChefProfile key={index} icon={each.icon} text={each.text} review={each.review} />
                ))}
               </div>
              </div>
            </div>
          </div>
  )
}