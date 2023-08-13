import mongoose, { Schema } from 'mongoose';
import { ObjectId, Relation } from '@type/database';
import { CategorieDB } from './categorie';
import { BrandDB } from './brand';
import { ProductDB } from './product';

export interface DiscountDB {
  category?: Relation<CategorieDB>;
  brand?: Relation<BrandDB>;
  product?: Relation<ProductDB>;
  discount: number;
}

const discountSchema = new Schema<DiscountDB>({
  product: { type: ObjectId, ref: 'Product' },
  category: { type: ObjectId, ref: 'Category' },
  brand: { type: ObjectId, ref: 'Brand' },
  discount: { type: Number, required: true },
});

discountSchema.index({ product: 1, category: 1, brand: 1 }, { unique: true });

const DiscountModel = mongoose.model('Discount', discountSchema);
export default DiscountModel;
