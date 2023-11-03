import mongoose, { Document, Schema } from 'mongoose';
import { BrandDB } from './brand';
import { CategoryDB } from './category';
import { AdminDB } from './admin';
import { ObjectId, Relation } from '@type/database';

export interface ProductDB extends Document {
  title: string;
  description: string;
  price: number;
  imagesURL: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  brandName?: string;
  brand?: Relation<BrandDB>;
  stock?: number;
  rate: number;
  is_new: boolean;
  available: boolean;
  discount?: number;
  category: Relation<CategoryDB>;
  addedBy: Relation<AdminDB>;
  tags: string[];
  gender: number;
}
const productSchema = new Schema<ProductDB>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imagesURL: [String],
    colors: [{ type: { name: String, hex: String } }],
    sizes: [String],
    brandName: { type: String },
    brand: { type: ObjectId, ref: 'Brand' },
    stock: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    is_new: { type: Boolean, default: true },
    available: { type: Boolean, default: true },
    discount: Number,
    category: { type: ObjectId, ref: 'Categorie' },
    tags: [String],
    gender: { type: Number, required: true },
    addedBy: { type: ObjectId, ref: 'Admin' },
  },
  { timestamps: true },
);

productSchema.index({ title: 'text' });

const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;
