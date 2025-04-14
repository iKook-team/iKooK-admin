import Constants from '../../../utils/constants';
import { getImageUrl } from '../../../utils/getImageUrl';
import { User } from '../../users/data/model.ts';
import { Menu } from '../../menus/data/model.ts';

type RowListProps = {
  title: string;
  list: string[];
};

type ListTileProps = {
  title: string;
  subtitle: string;
};
type EnquiryProfileProps = {
  icon: string;
  text: string;
  review: string | null;
};

type EnquiryProfileListTileProps = {
  chef: User;
  menu?: Menu;
  enquiryProfileList: EnquiryProfileProps[];
  enquiryProfileList1: EnquiryProfileProps[];
};

export function RowList({ title, list }: RowListProps) {
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

export function ListTile({ title, subtitle }: ListTileProps) {
  return (
    <div className="flex flex-col gap-1 ">
      <h1 className="font-extrabold text-2xl">{title}</h1>
      <h1>{subtitle}</h1>
    </div>
  );
}

export function EnquiryChefProfile({ icon, text, review }: EnquiryProfileProps) {
  return (
    <div className="flex gap-1 items-center">
      <img src={getImageUrl(`icons/${icon}.svg`)} className="h-[14px] w-[14px]" alt="" />
      <h1>{text}</h1>
      {review && <h1>{review}</h1>}
    </div>
  );
}

export function EnquiryProfileListTile({
  chef,
  enquiryProfileList,
  enquiryProfileList1
}: EnquiryProfileListTileProps) {
  return (
    <div className="w-[80%]">
      <div className="flex border border-gray-300 shadow-lg py-2 px-1 gap-2">
        <img
          className="h-20 w-20 object-cover"
          src={Constants.getImageUrl(chef?.avatar, chef?.first_name)}
          alt={chef?.first_name}
        />
        <div className="flex flex-col ">
          <h1 className="capitalize font-bold mb-2">Large event with Chef {chef?.first_name}</h1>

          <div className="flex gap-2">
            {enquiryProfileList.map((each, index) => (
              <EnquiryChefProfile
                key={index}
                icon={each.icon}
                text={each.text}
                review={each.review}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {enquiryProfileList1.map((each, index) => (
              <EnquiryChefProfile
                key={index}
                icon={each.icon}
                text={each.text}
                review={each.review}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MenuProfileListTile({
  chef,
  menu,
  enquiryProfileList
}: EnquiryProfileListTileProps) {
  return (
    <div className="w-[80%]">
      <div className="flex border border-gray-300 shadow-lg py-2 px-1 gap-2">
        <img
          className="h-20 w-20 object-cover"
          src={Constants.getImageUrl(
            menu?.images?.[0]?.image ?? chef?.avatar,
            menu?.name ?? chef?.first_name
          )}
          alt={menu?.name ?? chef?.first_name}
        />
        <div className="flex flex-col">
          <h1 className="capitalize font-bold mb-2">{menu?.name}</h1>

          <h1 className="capitalize"> chef {chef?.first_name + ' ' + chef?.last_name}</h1>

          <div className="flex gap-2">
            {enquiryProfileList.map((each, index) => (
              <EnquiryChefProfile
                key={index}
                icon={each.icon}
                text={each.text}
                review={each.review}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
