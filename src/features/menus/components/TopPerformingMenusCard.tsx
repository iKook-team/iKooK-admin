import { useFetchTopMenusQuery } from '../domain/usecase.ts';
import { LoadingSpinner } from '../../../app/components/LoadingSpinner.tsx';
import { formatNumber } from '../../../utils/helper.ts';
import TrendingDown from '../../../app/assets/icons/trending-down.svg';
import TrendingUp from '../../../app/assets/icons/trending-up.svg';
import { ReactSVG } from 'react-svg';

export default function TopPerformingMenusCard() {
  const { data, isPending, error } = useFetchTopMenusQuery();
  return (
    <div className="rounded-md border border-dark-chocolate/40 pt-5 pl-3 pb-8 pr-8 space-y-6">
      <h3 className="font-semibold text-black-eerie text-base mb-5">Top Performing Menus</h3>
      {isPending ? (
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-red-base">Failed to load top performing menus</p>
        </div>
      ) : (
        data?.data?.map((menu) => (
          <div key={menu.id} className="grid grid-cols-[47fr_28fr_25fr] gapx-x-3 text-xs">
            <span className="line-clamp-1">{menu.name}</span>
            <span className="line-clamp-1 capitalize">Chef {menu.chef_name}</span>
            <div className="flex gap-2 items-center">
              <span className="flex-1 text-black-eerie text-end">
                {formatNumber(menu.num_bookings)}
              </span>
              <ReactSVG src={menu.num_bookings > 0 ? TrendingUp : TrendingDown} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
