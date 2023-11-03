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

export interface AdminLogin {
  email: string;
  password: string;
}

export interface TokenResult {
  token: string;
}

export enum AdminRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'superadmin',
  MANAGER = 'manager',
}
