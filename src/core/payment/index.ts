import PaymentModel from '@/database/models/payment';
import { AsyncSafeResult } from '@type/common';
import { PaymentData, PaymentResponse } from './interface';
import UserModel from '@/database/models/user';

class Payment {
  constructor() {}

  async create(paymentData: PaymentData, userId: string): AsyncSafeResult<PaymentResponse> {
    try {
      //TODO: Encrypt credit card data

      const payment = await PaymentModel.create(paymentData);

      const result: PaymentResponse = {
        cardName: payment.cardName || '',
        cardNumber: payment.cardNumber
          ? this._sliceLastFourDigits(payment.cardNumber)
          : '',
        exMonth: payment.exMonth || 0,
        exYear: payment.exYear || 0,
        method: payment.method,
        provider: payment.provider || '',
      };
      await UserModel.findByIdAndUpdate(userId, { $addToSet: { payments: payment } });
      return { result, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }

  _sliceLastFourDigits(inputString: string): string {
    if (typeof inputString !== 'string') {
      throw new Error('Input must be a string.');
    }
    return inputString.slice(-4);
  }
}

export default new Payment();
