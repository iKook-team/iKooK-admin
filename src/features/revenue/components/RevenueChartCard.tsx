import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { LoadingSpinner } from '../../../app/components/LoadingSpinner.tsx';
import { useMemo } from 'react';
import { formatCurrency } from '../../../utils/helper.ts';
import { capitalizeWords, fromSnakeCase } from '../../../utils/strings.ts';
import { useFetchRevenueInsightsQuery } from '../domain/usecase.ts';
import { DateTime } from 'luxon';

interface RevenueChartCardProps {
  filter: string;
  setFilter: (filter: string) => void;
}

export default function RevenueChartCard({ filter, setFilter }: RevenueChartCardProps) {
  const { data: response, isPending, error } = useFetchRevenueInsightsQuery(filter);

  const data = response?.data;

  const chart = useMemo(() => {
    if (!data) {
      return [];
    }

    return Object.keys(data).map((key) => {
      return {
        name: filter === 'weekly' ? DateTime.fromFormat(key, 'cccc').toFormat('ccc') : key,
        current_week: filter === 'weekly' ? data[key] : undefined,
        current_month: filter === 'monthly' ? data[key] : undefined
      };
    });
  }, [data, filter]);

  const buttonClass = 'btn btn-ghost bg-transparent font-semibold text-sm text-black-eerie';
  return (
    <div className="px-6 pb-6 pt-2.5 rounded-md border border-dark-charcoal/40">
      <div className="flex items-center">
        <div className="flex gap-1 items-center">
          <h3 className={buttonClass}>Revenue</h3>
          {['weekly', 'monthly'].map((f) => (
            <button
              key={f}
              className={`${buttonClass} capitalize ${filter === f ? '' : '!text-black-base/40 font-normal'}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <hr className="mx-4 h-7 w-0.5 bg-black-base/20" />
        <div className="flex gap-4 text-black-eerie text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-black-eerie" />
            <span>{filter === 'weekly' ? 'Current Week' : 'Current Month'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>{filter === 'weekly' ? 'Previous Week' : 'Previous Month'}</span>
          </div>
        </div>
      </div>
      {isPending ? (
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner isLoading={true} />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-black-base/40">Failed to load data</p>
        </div>
      ) : (
        <ResponsiveContainer maxHeight={275} minHeight={241} className="min-h-[10rem]">
          <LineChart width={639} data={chart}>
            <Line
              dot={false}
              type="monotone"
              dataKey={filter === 'weekly' ? 'current_week' : 'current_month'}
              stroke="#1C1C1C"
              strokeWidth={3}
            />
            <Line
              dot={false}
              type="monotone"
              dataKey={filter === 'weekly' ? 'previous_week' : 'previous_month'}
              stroke="#FCC01C"
              strokeWidth={3}
            />
            <CartesianGrid stroke="#0000000D" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis axisLine={false} />
            <Tooltip
              formatter={(value, name) => [
                formatCurrency(Number(value)),
                capitalizeWords(fromSnakeCase(String(name)))
              ]}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
