import mongoose from 'mongoose';
import { UserDB } from './user';
import { ProductDB } from './product';
import { Relation } from '@type/database';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export interface ReviewDB {
  user: Relation<UserDB>;
  product: Relation<ProductDB>;
  comment: string;
  rate: number;
}

const reviewSchema = new Schema<ReviewDB>(
  {
    user: { type: ObjectId, ref: 'User' },
    product: { type: ObjectId, ref: 'Product' },
    comment: { type: String, required: true },
    rate: { type: Number, required: true, min: 0, max: 5 },
  },
  { timestamps: true },
);

const ReviewModel = mongoose.model('Review', reviewSchema);
