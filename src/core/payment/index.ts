import PaymentModel from "@/database/models/payment";
import { AsyncSafeResult } from "@type/common";
import { PaymentData, PaymentResponse } from "./interface";

class Payment {
    constructor() {}

    async create(paymentData: PaymentData): AsyncSafeResult<PaymentResponse> {
        try {
            const payment = await PaymentModel.create({
                cardName: paymentData.cardName,
                cardNumber: paymentData.cardNumber,
                cvv: paymentData.cvv,
                exMonth: paymentData.exMonth,
                exYear: paymentData.exYear,
                method: paymentData.method,
                provider: paymentData.provider
            })
        
            const result: PaymentResponse = {
                cardName: payment.cardName || '',
                cardNumber: payment.cardNumber ? this._sliceLastFourDigits(payment.cardNumber) : '',
                exMonth: payment.exMonth || 0,
                exYear: payment.exYear || 0,
                method: payment.method,
                provider: payment.provider || ''
            }
            return { result, error: null }
        } catch (err) {
            return { error: err, result: null }
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