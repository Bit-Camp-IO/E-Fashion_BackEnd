export interface ChatData {
  id: string,
  user: string;
  admin: string;
  messages: { sender: string; content: string; createdAt: Date; }[];
  status: string
}