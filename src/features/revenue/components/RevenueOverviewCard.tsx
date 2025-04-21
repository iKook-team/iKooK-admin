import { formatCurrency, formatNumber } from '../../../utils/helper.ts';
import TrendingUp from '../../../app/assets/icons/trending-up.svg';
import TrendingDown from '../../../app/assets/icons/trending-down.svg';
import { ReactSVG } from 'react-svg';
import { LoadingSpinner } from '../../../app/components/LoadingSpinner.tsx';

interface RevenueOverviewCardProps {
  title: string;
  amount?: number;
  percentage?: number;
  percentageDescription?: string;
  percentageStyled?: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  formatAsNumber?: boolean;
}

export function RevenueOverviewCard(props: RevenueOverviewCardProps) {
  const amount = props.amount ?? 0;
  const percentageStyled = props.percentageStyled !== false;
  return (
    <div className="flex flex-col items-start justify-center h-[9.625rem] px-6 bg-white rounded-md border border-black/20">
      <h5 className="text-sm">{props.title}</h5>
      {props.hasError ? (
        <div className="text-red-base">Error fetching data</div>
      ) : props.isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h3 className="mt-1 font-semibold text-[2.4375rem] overflow-clip">
            {props.formatAsNumber ? formatNumber(amount) : formatCurrency(amount, undefined, 0)}
          </h3>
          <p className="text-base inline-flex gap-1">
            {typeof props.percentage === 'number' && percentageStyled ? (
              <span className="inline-flex gap-0.5 items-center">
                <ReactSVG src={props.percentage > 0 ? TrendingUp : TrendingDown} wrapper="span" />
                <span
                  className={`text-base ${props.percentage > 0 ? 'text-green' : 'text-red-base'}`}
                >
                  {props.percentage}%
                </span>
              </span>
            ) : typeof props.percentage === 'number' ? (
              <span className="text-dark-charcoal/70">{props.percentage}</span>
            ) : null}
            <span className={`text-dark-charcoal/70 ${percentageStyled ? 'font-light' : ''}`}>
              {props.percentageDescription ?? 'from last month'}
            </span>
          </p>
        </>
      )}
    </div>
  );
}
