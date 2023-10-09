import mongoose, { Document, Schema } from 'mongoose';
import { ProductDB } from './product';
import { ObjectId, Relation } from '@type/database';

export interface CartDB extends Document {
  totalQuantity: number;
  items: { product: Relation<ProductDB>; quantity: number; color: string; size: string }[];
}

const cartSchema = new Schema<CartDB>({
  totalQuantity: {
    type: Number,
    default: 0,
  },
  items: [
    {
      product: { type: ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
      size: String,
      color: String,
      _id: false,
    },
  ],
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;
