import { GenericResponse, PagedResponse } from '../../../app/data/dto.ts';
import { Payment } from './model.ts';

export type GetRevenueOverviewResponse = GenericResponse<{
  total_orders: number;
  total_revenue: number;
  current_month_revenue: number;
  total_chef_payout: number;
  orders_percentage_change: number;
  revenue_percentage_change: number;
  current_day_chef_payments: number;
}>;

export type GetRevenueInsightsResponse = GenericResponse<{
  [key: string]: string;
}>;

export type GetAllPaymentsResponse = GenericResponse<PagedResponse<Payment>>;
