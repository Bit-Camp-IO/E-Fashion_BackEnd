import mongoose from 'mongoose';
import { ProductDB } from './product';
import { Relation } from '@type/database';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export interface CartDB {
  totalPrice: number;
  totalQuantity: number;
  items: {
    product: Relation<ProductDB>;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }[];
}

const cartSchema = new Schema<CartDB>({
  totalPrice: {
    type: Number,
    default: 0,
  },
  totalQuantity: {
    type: Number,
    default: 0,
  },
  items: [
    {
      product: { type: ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
      size: String,
      color: String,
    },
  ],
});

const CartModel = mongoose.model('Cart', cartSchema);
