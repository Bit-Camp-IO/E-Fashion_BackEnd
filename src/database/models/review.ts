import mongoose, { Schema } from 'mongoose';
import { UserDB } from './user';
import { ProductDB } from './product';
import { ObjectId, Relation } from '@type/database';

export interface ReviewDB
  extends mongoose.Document,
    mongoose.ResolveTimestamps<{ createdAt: Date; updatedAt: Date }, { timestamps: true }> {
  user: Relation<UserDB>;
  product: Relation<ProductDB>;
  comment: string;
  rate: number;
}

const reviewSchema = new Schema<ReviewDB>(
  {
    user: { type: ObjectId, ref: 'User', required: true },
    product: { type: ObjectId, ref: 'Product' },
    comment: { type: String, default: '' },
    rate: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true },
);

const ReviewModel = mongoose.model('Review', reviewSchema);
export default ReviewModel;
