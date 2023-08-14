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
    postalCode: number;
  };
  phoneNumber: string;
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
        size: { type: String },
        color: { type: String },
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
      postalCode: {
        type: Number,
        required: true,
      },
    },
    phoneNumber: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    price: { type: Number, required: true },
    tax: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['CASH', 'STRIPE'] },
  },
  { timestamps: true },
);

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;
