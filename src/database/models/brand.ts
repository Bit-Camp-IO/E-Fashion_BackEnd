import mongoose, { Schema } from 'mongoose';
import { ProductDB } from './product';
import { ObjectId, RelationList } from '@type/database';

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
