import { Booking, Quote } from '../data/model';
import {  QuoteMenuList } from './BookingBudgetCard';
import QuotesColumn from './QuotesColumn';
import { MenuProfileListTile } from './RoundedRowList';

interface IconTextItem {
  icon: string;
  text: string;
}

interface MenuItem {
  icon: string;
  text: string;
  extratext?: string;
}

type EnquiryProfileProps = {
  icon: string;
  text: string;
  review: string | null;
};


type ViewQuotesProps = {
  booking: Booking;
  quote?: Quote;
  enquiryProfileList: EnquiryProfileProps[];
  enquiryProfileList1: EnquiryProfileProps[];
  iconTextList: IconTextItem[];
  menuList: MenuItem[];
};

export function ViewQuoteModal({
  booking,
  quote,
  enquiryProfileList,
  iconTextList,
  menuList
}: ViewQuotesProps): JSX.Element {
  return (
    <div className="flex ">
      <div className="w-full ">
        <h1 className="font-bold text-xl mb-3">Here is your Quote</h1>
        <MenuProfileListTile
          booking={booking}
          enquiryProfileList={enquiryProfileList}
          enquiryProfileList1={[]}
        />

        <QuoteMenuList
          starterList={quote!.starter}
          mainList={quote!.main}
          dessertList={quote!.dessert}
        />
      </div>
      <div className="w-[65%]">
        <QuotesColumn booking={booking} iconTextList={iconTextList} menuList={menuList} />
      </div>
    </div>
  );
}
