import { useFetchPaymentsQuery, useFetchRevenueOverviewQuery } from './domain/usecase.ts';
import { RevenueOverviewCard } from './components/RevenueOverviewCard.tsx';
import { Link } from 'react-router-dom';
import PageTable from '../../app/components/page/PageTable.tsx';
import PaymentsHeader from './components/PaymentsHeader.tsx';
import PaymentRow from './components/PaymentRow.tsx';
import RevenueChartRow from './components/RevenueChartRow.tsx';

export default function RevenueOverviewScreen() {
  const {
    data: revenueOverview,
    isPending: revenueOverviewPending,
    error: revenueOverviewError
  } = useFetchRevenueOverviewQuery();

  const { payments, isPending: paymentsPending, error: paymentsError } = useFetchPaymentsQuery();

  const overviewExtras = {
    isLoading: revenueOverviewPending,
    hasError: !!revenueOverviewError
  };

  return (
    <>
      <div className="flex gap-3 items-center">
        <h1 className="font-medium texl-xl">Overview</h1>
        {/*<CountrySwitcher currency={currency} setCurrency={setCurrency} />*/}
      </div>
      <div className="mt-3 grid 2xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
        <RevenueOverviewCard
          title="Orders"
          amount={revenueOverview?.data?.total_orders}
          percentage={revenueOverview?.data?.orders_percentage_change}
          {...overviewExtras}
          formatAsNumber={true}
        />
        <RevenueOverviewCard
          title="Total Revenue"
          amount={revenueOverview?.data?.total_revenue}
          percentage={revenueOverview?.data?.revenue_percentage_change}
          {...overviewExtras}
        />
        <RevenueOverviewCard
          title="Chefs Payout"
          amount={revenueOverview?.data?.total_chef_payout}
          percentage={revenueOverview?.data?.current_day_chef_payments}
          percentageStyled={false}
          percentageDescription="payouts today"
        />
        <RevenueOverviewCard
          title="Monthly Revenue"
          amount={revenueOverview?.data?.current_month_revenue}
          percentage={revenueOverview?.data?.revenue_percentage_change}
          {...overviewExtras}
        />
      </div>
      <RevenueChartRow />
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
