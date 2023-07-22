import PaymentModel from "@/database/models/payment";
import { AsyncSafeResult } from "@type/common";
import { PaymentData, PaymentResponse } from "./interface";
import crypto from 'node:crypto'
import Config from "@/config";

class Payment {
    constructor() {}

    async create(paymentData: PaymentData): AsyncSafeResult<PaymentResponse> {
        try {
            const encryptedCardNumber = this._encrypt(paymentData.cardNumber);
            const encryptedCVV = this._encrypt(paymentData.cvv.toString());

            const payment = await PaymentModel.create({
                ...paymentData,
                cardNumber: encryptedCardNumber,
                cvv: encryptedCVV
            })
        
            const result: PaymentResponse = {
                cardName: payment.cardName || '',
                cardNumber: payment.cardNumber ? this._sliceLastFourDigits(this._decrypt(payment.cardNumber)) : '',
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

    _encrypt(text: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(Config.ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`;
      }
    
    _decrypt(encryptedText: string): string {
        const [iv, encrypted] = encryptedText.split(':');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(Config.ENCRYPTION_KEY), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
      }
}

export default new Payment();