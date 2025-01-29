export interface SupportTicketReply {
  message: string;
  created_at: string;
  is_admin: boolean;
}

export interface SupportTicket {
  id: string;
  user: {
    username: string;
    first_name: string;
    last_name: string;
    country: string;
    email: string;
    photo: string;
    mobile: string;
    location: string | null;
  };
  title: string;
  status: string;
  ticket_id: string;
  category: string;
  message: string;
  recent_message: string;
  updated_at: string;
  replies: SupportTicketReply[];
  responded: boolean;
}
