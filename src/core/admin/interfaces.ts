export interface AdminResult {
  name: string;
  id: string;
  createdAt: Date;
  role: string;
}

export interface AdminData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}
