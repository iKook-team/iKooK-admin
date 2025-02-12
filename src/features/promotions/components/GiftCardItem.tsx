import { GiftCard } from '../domain/types.ts';
import { formatCurrency } from '../../../utils/helper.ts';
import logo from '../../../app/assets/icons/logo.svg';
import { ReactSVG } from 'react-svg';

export default function GiftCardItem(props: GiftCard) {
  return (
    <div className="relative aspect-[358/187] bg-primary rounded-xl text-white text-[1.6875rem]">
      <div className="h-full flex flex-col justify-between">
        <span className="px-4 pt-3 font-bold leading-10 overflow-hidden">
          {formatCurrency(props.amount, props.currency)}
        </span>
        <div className="flex justify-between pl-4 pb-[1.125rem] pr-2.5 items-center">
          <div className="flex flex-col items-center">
            <span className="font-semibold leading-8">iKooK</span>
            <span className="text-xs leading-3">Gift Card</span>
          </div>
        </div>
      </div>
      <div className="absolute right-[-1.5rem] top-[1rem] h-[60%]">
        <ReactSVG src={logo} className="aspect-[321/109] h-full text-white/20" wrapper="svg" />
      </div>
    </div>
  );
}
