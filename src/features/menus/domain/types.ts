export interface UpdateMenuStatusRequest {
  id: string;
  status: 'approve' | 'unapprove';
  reason?: string;
}
