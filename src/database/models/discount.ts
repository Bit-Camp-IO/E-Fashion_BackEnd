import mongoose, { Schema } from 'mongoose';
import { ObjectId, RelationList } from '@type/database';
import { CategorieDB } from './categorie';
import { BrandDB } from './brand';
import { ProductDB } from './product';

export interface DiscountDB {
  categories?: RelationList<CategorieDB>;
  brands?: RelationList<BrandDB>;
  products?: RelationList<ProductDB>;
  discount: number;
  startDate: Number;
  endDate: Number;
}

const discountSchema = new Schema<DiscountDB>({
  products: [{ type: ObjectId, ref: 'Product' }],
  categories: [{ type: ObjectId, ref: 'Category' }],
  brands: [{ type: ObjectId, ref: 'Brand' }],
  discount: { type: Number, required: true },
  startDate: { type: Number, required: true, default: Date.now },
  endDate: { type: Number, required: true }
});

const DiscountModel = mongoose.model('Discount', discountSchema);
export default DiscountModel;
