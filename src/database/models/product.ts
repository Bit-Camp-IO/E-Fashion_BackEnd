import mongoose, {Schema} from 'mongoose';
import {BrandDB} from './brand';
import {ReviewDB} from './review';
import {CategorieDB} from './categorie';
import {AdminDB} from './admin';
import {ObjectId, Relation, RelationList} from '@type/database';

export interface ProductDB {
  title: string;
  description: string;
  price: number;
  imagesURL: string[];
  colors?: {name: string; hex: string}[];
  sizes?: string[];
  brandName?: string;
  brand?: Relation<BrandDB>;
  stock?: number;
  rate: number;
  is_new: boolean;
  available: boolean;
  discount?: number;
  reviews: RelationList<ReviewDB>;
  categories: RelationList<CategorieDB>;
  addedBy: Relation<AdminDB>;
  tags: string[];
  gender: string;
}
const productSchema = new Schema<ProductDB>(
  {
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    imagesURL: [String],
    colors: [{type: {name: String, hex: String}}],
    sizes: [String],
    brandName: String,
    brand: {type: ObjectId, ref: 'Brand'},
    stock: {type: Number, default: 0},
    rate: {type: Number, default: 0},
    is_new: {type: Boolean, default: true},
    available: {type: Boolean, default: true},
    discount: Number,
    reviews: [{type: ObjectId, ref: 'Review'}],
    categories: [{type: ObjectId, ref: 'Categorie'}],
    tags: [String],
    gender: String,
    addedBy: {type: ObjectId, ref: 'Admin'},
  },
  {timestamps: true},
);

const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;
