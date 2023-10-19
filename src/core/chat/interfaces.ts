export interface ChatData {
  id: string;
  user: string;
  // admin: string;
  // messages: { sender: string; content: string; date: Date; me: boolean }[];
  status: string;
}

export interface MessageResult {
  content: string;
  date: Date;
  me: boolean;
}
