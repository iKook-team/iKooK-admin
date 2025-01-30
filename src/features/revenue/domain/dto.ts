import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';
import { Payment } from './model.ts';

export type GetRevenueOverviewResponse = GenericResponse<{
  total_revenue: {
    revenue: number;
    percentage_difference: number;
  };
  monthly_revenue: {
    revenue: number;
    percentage_difference: number;
  };
  chef_payouts: {
    total_amount: number;
    today_counts: number;
  };
  order_insight: {
    order_counts: number;
    percentage_difference: number;
  };
}>;

export type GetRevenueInsightsResponse = GenericResponse<{
  [key: string]: Array<{
    day_name?: string;
    week?: number;
    total_revenue: number;
  }>;
}>;

export type GetAllPaymentsResponse = GenericResponse<PagedResponse<Payment>>;
