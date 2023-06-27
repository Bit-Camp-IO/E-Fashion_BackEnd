import mongoose from 'mongoose';
import { UserDB } from './user';
import { AddressDB } from './address';
import { PaymentDB } from './payment';
import { ProductDB } from './product';
import { Relation } from '@type/database';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export interface OrderDB {
  items: {
    product: Relation<ProductDB>;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }[];
  user: Relation<UserDB>;
  address: Relation<AddressDB>;
  payment: Relation<PaymentDB>;
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
    address: { type: ObjectId, ref: 'Address' },
    payment: { type: ObjectId, ref: 'Payment' },
    totalPrice: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    price: { type: Number, required: true },
    tax: { type: Number, required: true },
  },
  { timestamps: true },
);

const OrderModel = mongoose.model('Order', orderSchema);
