import mongoose, { Schema } from 'mongoose';
import { AdminDB } from './admin';
import { ObjectId, Relation } from '@type/database';

export interface CategoryDB extends mongoose.Document {
  name: string;
  description?: string;
  imageURL: string;
  addedBy: Relation<AdminDB>;
  gender: number;
}

const categorySchema = new Schema<CategoryDB>(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    description: {
      type: String,
    },
    imageURL: {
      type: String,
    },

    gender: {
      type: Number,
      required: true,
    },

    addedBy: {
      type: ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true },
);

const CategoryModel = mongoose.model('Category', categorySchema);
export default CategoryModel;
