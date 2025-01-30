import CountrySwitcher from '../../app/components/CountrySwitcher.tsx';
import { useQueryState } from 'nuqs';
import { useFetchRevenueOverviewQuery } from './domain/usecase.ts';
import { RevenueOverviewCard } from './components/RevenueOverviewCard.tsx';
import { removeFields } from '../../utils/fieldManipulation.ts';

export default function RevenueOverviewScreen() {
  const [currency, setCurrency] = useQueryState('currency', {
    defaultValue: 'NGN'
  });

  const {
    data: revenueOverview,
    isPending: revenueOverviewPending,
    error: revenueError
  } = useFetchRevenueOverviewQuery(currency);

  const overviewExtras = { isLoading: revenueOverviewPending, hasError: !!revenueError, currency };

  return (
    <>
      <div className="flex gap-3 items-center">
        <h1 className="font-medium texl-xl">Overview</h1>
        <CountrySwitcher currency={currency} setCurrency={setCurrency} />
      </div>
      <div className="mt-3 grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        <RevenueOverviewCard
          title="Orders"
          amount={revenueOverview?.order_insight.order_counts}
          percentage={revenueOverview?.order_insight.percentage_difference}
          {...overviewExtras}
        />
        <RevenueOverviewCard
          title="Total Revenue"
          amount={revenueOverview?.total_revenue.revenue}
          percentage={revenueOverview?.total_revenue.percentage_difference}
          {...overviewExtras}
        />
        <RevenueOverviewCard
          title="Chefs Payout"
          amount={revenueOverview?.chef_payouts.total_amount}
          percentageDescription={`${revenueOverview?.chef_payouts.today_counts} payouts today`}
          {...removeFields(overviewExtras, 'currency')}
        />
        <RevenueOverviewCard
          title="Monthly Revenue"
          amount={revenueOverview?.monthly_revenue.revenue}
          percentage={revenueOverview?.monthly_revenue.percentage_difference}
          {...overviewExtras}
        />
      </div>
    </>
  );
}
