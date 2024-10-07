export interface GenericResponse<T> {
  data: T;
  success: boolean;
}

export interface PagedResponse<T> {
  current_page: number;
  has_next: boolean;
  has_previous: boolean;
  number_of_pages: number;
  total_count: number;
  items: T[];
}
