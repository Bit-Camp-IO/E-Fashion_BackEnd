export interface PaymentData {
  method: 'VISA' | 'MASTERCARD';
  cardNumber: string;
  cardName: string;
  exMonth: number;
  exYear: number;
  cvv: number;
  provider: string;
}

export interface PaymentResponse {
  cardName: string;
  cardNumber: string;
  exMonth: number;
  exYear: number;
  method: string;
  provider: string;
}