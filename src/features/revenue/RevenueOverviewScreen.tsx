import CountrySwitcher from '../../app/components/CountrySwitcher.tsx';
import { useQueryState } from 'nuqs';
import { useFetchRevenueOverviewQuery } from './domain/usecase.ts';
import { RevenueOverviewCard } from './components/RevenueOverviewCard.tsx';
import { removeFields } from '../../utils/fieldManipulation.ts';
import RevenueChartCard from './components/RevenueChartCard.tsx';
import TopPerformingMenusCard from '../menus/components/TopPerformingMenusCard.tsx';

export default function RevenueOverviewScreen() {
  const [currency, setCurrency] = useQueryState('currency', {
    defaultValue: 'NGN'
  });
  const [filter, setFilter] = useQueryState('filter', {
    defaultValue: 'weekly'
  });

  const {
    data: revenueOverview,
    isPending: revenueOverviewPending,
    error: revenueOverviewError
  } = useFetchRevenueOverviewQuery(currency);

  const overviewExtras = {
    isLoading: revenueOverviewPending,
    hasError: !!revenueOverviewError,
    currency
  };

  return (
    <>
      <div className="flex gap-3 items-center">
        <h1 className="font-medium texl-xl">Overview</h1>
        <CountrySwitcher currency={currency} setCurrency={setCurrency} />
      </div>
      <div className="mt-3 grid 2xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
        <RevenueOverviewCard
          title="Orders"
          amount={revenueOverview?.data?.order_insight.order_counts}
          percentage={revenueOverview?.data?.order_insight.percentage_difference}
          {...overviewExtras}
        />
        <RevenueOverviewCard
          title="Total Revenue"
          amount={revenueOverview?.data?.total_revenue.revenue}
          percentage={revenueOverview?.data?.total_revenue.percentage_difference}
          {...overviewExtras}
        />
        <RevenueOverviewCard
          title="Chefs Payout"
          amount={revenueOverview?.data?.chef_payouts.total_amount}
          percentageDescription={`${revenueOverview?.data?.chef_payouts.today_counts} payouts today`}
          {...removeFields(overviewExtras, 'currency')}
        />
        <RevenueOverviewCard
          title="Monthly Revenue"
          amount={revenueOverview?.data?.monthly_revenue.revenue}
          percentage={revenueOverview?.data?.monthly_revenue.percentage_difference}
          {...overviewExtras}
        />
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-5">
        <RevenueChartCard filter={filter} setFilter={setFilter} currency={currency} />
        <TopPerformingMenusCard currency={currency} />
      </div>
    </>
  );
}
