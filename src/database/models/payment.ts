import mongoose, { Schema } from 'mongoose';

export interface PaymentDB {
  method: string;
  cardNumber?: string;
  cardName?: string;
  exMonth?: number;
  exYear?: number;
  cvv?: number;
  provider?: string;
}

const paymentSchema = new Schema<PaymentDB>(
  {
    method: {
      type: String,
      enum: ['VISA', 'MASTERCARD'],
      required: true,
    },
    cardName: String,
    cardNumber: String,
    exMonth: Number,
    exYear: Number,
    cvv: Number,
    provider: String,
  },
  {
    timestamps: true,
  }
);

const PaymentModel = mongoose.model('Payment', paymentSchema);
export default PaymentModel;