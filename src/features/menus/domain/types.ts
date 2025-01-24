export interface UpdateMenuStatusRequest {
  menuId: string;
  status: 'approve' | 'unapprove';
  message?: string;
}
