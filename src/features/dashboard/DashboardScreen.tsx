import CountrySwitcher from '../../app/components/CountrySwitcher.tsx';
import { useQueryState } from 'nuqs';
import RevenueChartRow from '../revenue/components/RevenueChartRow.tsx';
import { useFetchRevenueOverviewQuery } from '../revenue/domain/usecase.ts';
import { RevenueOverviewCard } from '../revenue/components/RevenueOverviewCard.tsx';
import { useFetchBookingsQuery } from '../bookings/domain/usecase.ts';
import PageTable from '../../app/components/page/PageTable.tsx';
import BookingsHeader from '../bookings/components/BookingsHeader.tsx';
import BookingRow from '../bookings/components/BookingRow.tsx';

export default function DashboardScreen() {
  const [currency, setCurrency] = useQueryState('currency', {
    defaultValue: 'NGN'
  });

  const {
    data: revenueOverview,
    isPending: revenueOverviewPending,
    error: revenueOverviewError
  } = useFetchRevenueOverviewQuery(currency);

  const {
    bookings,
    bookingType,
    isPending: bookingsPending,
    error: bookingsError
  } = useFetchBookingsQuery();

  const overviewExtras = {
    isLoading: revenueOverviewPending,
    hasError: !!revenueOverviewError
  };

  return (
    <>
      <div className="flex gap-3 items-center">
        <h1 className="font-medium texl-xl">Overview</h1>
        <CountrySwitcher currency={currency} setCurrency={setCurrency} />
      </div>
      <div className="mt-3 grid 2xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
        <RevenueOverviewCard
          title="Users"
          amount={revenueOverview?.data?.user_insight.count}
          percentage={revenueOverview?.data?.user_insight.percentage_difference}
          {...overviewExtras}
        />
        <RevenueOverviewCard
          title="Chefs"
          amount={revenueOverview?.data?.chef_insight.count}
          percentage={revenueOverview?.data?.chef_insight.percentage_difference}
          {...overviewExtras}
        />
        <RevenueOverviewCard
          title="Orders"
          amount={revenueOverview?.data?.order_insight.order_counts}
          percentage={revenueOverview?.data?.order_insight.percentage_difference}
          {...overviewExtras}
        />
        <RevenueOverviewCard
          title="Revenue"
          amount={revenueOverview?.data?.monthly_revenue.revenue}
          percentage={revenueOverview?.data?.monthly_revenue.percentage_difference}
          {...overviewExtras}
          currency={currency}
        />
      </div>
      <RevenueChartRow currency={currency} />
      <div>
        <h3 className="pt-6 pb-3 font-semibold text-black-eerie text-xl">Recent Bookings</h3>
        <PageTable
          isFetching={bookingsPending}
          emptyMessage={
            bookingsError?.message ?? (bookings.length == 0 ? 'No payment found' : undefined)
          }
          header={<BookingsHeader type={bookingType} />}
          body={bookings.map((booking) => {
            return <BookingRow key={booking.id} {...booking} type={bookingType} />;
          })}
          page={0}
          numberOfPages={0}
          includePagination={false}
        />
      </div>
    </>
  );
}
