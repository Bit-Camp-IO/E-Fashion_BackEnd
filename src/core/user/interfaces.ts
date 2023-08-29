import { AddressData } from '../address/interfaces';

export interface FavItem {
  title: string;
  price: number;
  id: string;
}

export interface CartItemData {
  id: string;
  quantity: number;
  size: string;
  color: string;
}

export interface CartItem extends Omit<CartItemData, 'id'> {
  productId: string;
  imageUrl: string;
}

export interface CartResult {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  totalQuantity: number;
}

export interface UserResult {
  email: string;
  fullName: string;
  phoneNumber?: string;
  provider: string;
  isVerified: boolean;
  settings: any;
  profile?: string;
  addresses: AddressData[];
}
