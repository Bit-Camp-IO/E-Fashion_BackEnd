import mongoose, { Schema } from 'mongoose';

export interface BrandDB {
  name: string;
  description: string;
  logo: string;
  link: string;
}

const brandSchema = new Schema<BrandDB>(
  {
    name: { type: String, required: true, unique: true },
    logo: String,
    description: { type: String, required: true },
    link: String,
  },
  { timestamps: true },
);

const BrandModel = mongoose.model('Brand', brandSchema);

export default BrandModel;
