import { AddressData } from '../address/interfaces';
import { PaymentData } from '../payment/interface';

export interface OrderData {
  userId: string;
  cartId: string;
  address: OrderAddress;
  payment: OrderPayment;
  paymentMethod: string;
  phoneNumber: string;
}

export type OrderAddress = Omit<AddressData, 'isPrimary'>;
export type OrderPayment = PaymentData | string;

export interface OrderResult {
  id: string;
  address: {
    city: string;
    state: string;
    phone: string;
    postalCode: number;
  };
  payment: {
    method: string;
    cardNumber?: string;
    cardName?: string;
    exMonth?: number;
    exYear?: number;
    cvv?: number;
    provider?: string;
  };
  paymentMethod: string;
  totalPrice: number;
  totalQuantity: number;
  price: number;
  tax: number;
}
