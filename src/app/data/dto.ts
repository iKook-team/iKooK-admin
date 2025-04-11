export interface GenericResponse<T> {
  data: T;
  success: boolean;
}

export interface PagedResponse<T> {
  count: number;
  next?: number;
  previous?: number;
  current: number;
  total: number;
  results: T[];
}
