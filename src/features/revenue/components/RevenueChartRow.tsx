import RevenueChartCard from './RevenueChartCard.tsx';
import TopPerformingMenusCard from '../../menus/components/TopPerformingMenusCard.tsx';
import { useQueryState } from 'nuqs';

export default function RevenueChartRow() {
  const [filter, setFilter] = useQueryState('filter', {
    defaultValue: 'weekly'
  });
  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-5">
      <RevenueChartCard filter={filter} setFilter={setFilter} />
      <TopPerformingMenusCard />
    </div>
  );
}
