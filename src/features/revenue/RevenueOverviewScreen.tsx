import CountrySwitcher from '../../app/components/CountrySwitcher.tsx';
import { useQueryState } from 'nuqs';
import { useFetchPaymentsQuery, useFetchRevenueOverviewQuery } from './domain/usecase.ts';
import { RevenueOverviewCard } from './components/RevenueOverviewCard.tsx';
import { removeFields } from '../../utils/fieldManipulation.ts';
import { Link } from 'react-router-dom';
import PageTable from '../../app/components/page/PageTable.tsx';
import PaymentsHeader from './components/PaymentsHeader.tsx';
import PaymentRow from './components/PaymentRow.tsx';
import RevenueChartRow from './components/RevenueChartRow.tsx';

export default function RevenueOverviewScreen() {
  const [currency, setCurrency] = useQueryState('currency', {
    defaultValue: 'NGN'
  });

  const {
    data: revenueOverview,
    isPending: revenueOverviewPending,
    error: revenueOverviewError
  } = useFetchRevenueOverviewQuery(currency);

  const { payments, isPending: paymentsPending, error: paymentsError } = useFetchPaymentsQuery();

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
          percentage={revenueOverview?.data?.chef_payouts.today_counts}
          percentageStyled={false}
          percentageDescription="payouts today"
          {...removeFields(overviewExtras, 'currency')}
        />
        <RevenueOverviewCard
          title="Monthly Revenue"
          amount={revenueOverview?.data?.monthly_revenue.revenue}
          percentage={revenueOverview?.data?.monthly_revenue.percentage_difference}
          {...overviewExtras}
        />
      </div>
      <RevenueChartRow currency={currency} />
      <div>
        <div className="pt-6 pb-4 flex items-center justify-between text-black-eerie text-base">
          <h3 className="font-semibold">Payments</h3>
          <Link className="underline font-medium" to="payments">
            All payments
          </Link>
        </div>
        <PageTable
          isFetching={paymentsPending}
          emptyMessage={
            paymentsError?.message ?? (payments.length == 0 ? 'No payment found' : undefined)
          }
          header={<PaymentsHeader />}
          body={payments.map((payment) => {
            return <PaymentRow key={payment.id} {...payment} />;
          })}
          page={0}
          numberOfPages={0}
          includePagination={false}
        />
      </div>
    </>
  );
}
