import { AddressData } from '../address/interfaces';

export interface CartItemData {
  id: string;
  quantity: number;
  size: string;
  color: string;
}

export interface CartItem extends CartItemData {
  id: string;
  productId: string;
  imageUrl: string;
  title: string;
}

export interface CartResult {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  totalQuantity: number;
}

export interface UserResult {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  provider: string;
  isVerified: boolean;
  settings: any;
  profile?: string;
  address: AddressData;
}
