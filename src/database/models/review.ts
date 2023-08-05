import mongoose, { Schema } from 'mongoose';
import { UserDB } from './user';
import { ProductDB } from './product';
import { ObjectId, Relation } from '@type/database';

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
//handle rate re-calc on deletion

const ReviewModel = mongoose.model('Review', reviewSchema);
export default ReviewModel;