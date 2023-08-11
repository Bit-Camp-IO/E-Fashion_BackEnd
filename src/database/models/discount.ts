import mongoose, { Schema } from 'mongoose';
import { ObjectId, Relation } from '@type/database';
import { CategorieDB } from './categorie';
import { BrandDB } from './brand';
import { ProductDB } from './product';

export interface ReviewDB {
  category?: Relation<CategorieDB>;
  brand?: Relation<BrandDB>;
  product: Relation<ProductDB>
  discount: number;
}

const discountSchema = new Schema<ReviewDB>(
  {
    product: { type: ObjectId, ref: 'Product', required: true },
    category: { type: ObjectId, ref: 'Category' },
    brand: { type: ObjectId, ref: 'Brand' },
    discount: { type: Number, required: true }
  }
)

const DiscountModel = mongoose.model('Discount', discountSchema);
export default DiscountModel;