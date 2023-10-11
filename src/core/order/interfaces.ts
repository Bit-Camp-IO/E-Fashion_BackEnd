export interface OrderData {
  userId: string;
  phoneNumber: string;
}

export interface OrderResult {
  id: string;
  address: {
    longitude: number;
    latitude: number;
  };
  paymentMethod: string;
  totalPrice: number;
  totalQuantity: number;
  price: number;
  tax: number;
  status: number;
}

export type OrderPaymentMethod = 'CASH' | 'STRIPE';

export interface PaymentIntents {
  clientSecret: string;
}
