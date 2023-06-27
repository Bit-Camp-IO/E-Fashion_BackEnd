import mongoose from 'mongoose';
import { BrandDB } from './brand';
import { ReviewDB } from './review';
import { CategorieDB } from './categorie';
import { AdminDB } from './admin';
import { Relation, RelationList } from '@type/database';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export interface ProductDB {
  name: string;
  description: string;
  price: Number;
  imagesURL: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  brandName?: string;
  brand?: Relation<BrandDB>;
  stock?: Number;
  rate: Number;
  isNew: boolean;
  available: boolean;
  discount?: number;
  reviews: RelationList<ReviewDB>;
  categories: RelationList<CategorieDB>;
  addedBy: Relation<AdminDB>;
}
const productSchema = new Schema<ProductDB>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imagesURL: [{ type: String, required: true }],
    colors: [{ type: { name: String, hex: String } }],
    sizes: [String],
    brandName: String,
    brand: { type: ObjectId, ref: 'Brand' },
    stock: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    isNew: { type: Boolean, default: true },
    available: { type: Boolean, default: true },
    discount: Number,
    reviews: [{ type: ObjectId, ref: 'Review' }],
    categories: [{ type: ObjectId, ref: 'Categorie' }],
    addedBy: { type: ObjectId, ref: 'Admin' },
  },
  { timestamps: true },
);

const ProductModel = mongoose.model('Product', productSchema);
