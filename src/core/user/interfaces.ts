import { RelationList } from "@type/database";
import { AddressData } from "../address/interfaces";

export interface FavItem {
  title: string;
  price: number;
  id: string;
}

export interface CartItemData {
  id: string;
  size: string;
  color: string;
  quantity: number;
}

export interface CartItem extends Omit<CartItemData, 'id'> {
  title: string;
  price: number;
  product: string;
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
  provider: string;
  isVerified: boolean;
  settings: any;
  profile?: string;
  addresses: RelationList<AddressData>
}
