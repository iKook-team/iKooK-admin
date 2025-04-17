import { User } from '../../users/data/model.ts';

export interface SupportTicketReply {
  message: string;
  created_at: string;
  is_admin: boolean;
}

export interface SupportTicket {
  id: number;
  user: User;
  admin: User | null;
  category: string;
  title: string;
  status: string;
  created_at: string;
}

export interface SupportTicketMessage {
  id: number;
  message: string;
  created_at: string;
  sender: User;
  ticket: number;
}
