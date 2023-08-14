export interface OrderData {
  userId: string;
  addressId: string;
  phoneNumber: string;
}

export interface OrderResult {
  id: string;
  address: {
    city: string;
    state: string;
    postalCode: number;
  };
  paymentMethod: string;
  totalPrice: number;
  totalQuantity: number;
  price: number;
  tax: number;
}

export type OrderPaymentMethod = 'CASH' | 'STRIPE';

export interface PaymentIntents {
  clientSecret: string;
}
