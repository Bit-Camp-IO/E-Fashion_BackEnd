import mongoose, { Schema } from 'mongoose';
import { UserDB } from './user';
import { ProductDB } from './product';
import { ObjectId, Relation } from '@type/database';

export interface OrderDB extends mongoose.Document {
  items: {
    product: Relation<ProductDB>;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }[];
  user: Relation<UserDB>;
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

const orderSchema = new Schema<OrderDB>(
  {
    items: [
      {
        product: { type: ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String, required: true },
        color: { type: String, required: true },
      },
    ],
    user: { type: ObjectId, ref: 'User' },
    address: {
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      postalCode: {
        type: Number,
        required: true,
      },
    },
    payment: {
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
    totalPrice: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    price: { type: Number, required: true },
    tax: { type: Number, required: true },
  },
  { timestamps: true },
);

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;
