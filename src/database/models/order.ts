import mongoose, { Schema } from 'mongoose';
import { UserDB } from './user';
import { ProductDB } from './product';
import { ObjectId, Relation } from '@type/database';
import { CollectionDB } from './collection';

export interface OrderDB extends mongoose.Document {
  items: {
    product: Relation<ProductDB>;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }[];
  collection_item?: {
    name: string;
    price: number;
    collectionId: Relation<CollectionDB>;
  };
  user: Relation<UserDB>;
  address: {
    longitude: number;
    latitude: number;
  };
  phoneNumber: string;
  paymentMethod: string;
  totalPrice: number;
  totalQuantity: number;
  price: number;
  tax: number;
  item_type: 'collection' | 'cart';
}

const orderSchema = new Schema<OrderDB>(
  {
    items: [
      {
        type: {
          product: { type: ObjectId, ref: 'Product' },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
          size: { type: String },
          color: { type: String },
        },
        required: function (this: OrderDB) {
          return this.item_type === 'cart';
        },
      },
    ],
    user: { type: ObjectId, ref: 'User' },
    address: {
      longitude: {
        type: Number,
        required: true,
      },
      latitude: {
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
    collection_item: {
      type: {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        collectionId: {
          type: ObjectId,
          ref: 'Collection',
          required: true,
        },
      },
      required: function (this: OrderDB) {
        this.item_type === 'collection';
      },
    },
    item_type: {
      default: 'cart',
      enum: ['cart', 'collection'],
      type: String,
    },
  },
  { timestamps: true },
);

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;
