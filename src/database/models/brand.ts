import mongoose from 'mongoose';
import { ProductDB } from './product';
import { RelationList } from '@type/database';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

export interface BrandDB {
  name: string;
  description: string;
  logo: string;
  products: RelationList<ProductDB>;
}

const brandSchema = new Schema<BrandDB>(
  {
    name: { type: String, required: true },
    logo: String,
    description: { type: String, required: true },
    products: [{ type: ObjectId, ref: 'Product' }],
  },
  { timestamps: true },
);

const BrandModel = mongoose.model('Brand', brandSchema);
