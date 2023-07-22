import mongoose, { Schema } from 'mongoose';
import { AdminDB } from './admin';
import { ObjectId, Relation, RelationList } from '@type/database';

export interface CategorieDB extends mongoose.Document {
  name: string;
  description?: string;
  imageURL: string;
  isMain: boolean;
  subCategories: RelationList<CategorieDB>;
  addedBy: Relation<AdminDB>;
}

const categorySchema = new Schema<CategorieDB>(
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
    isMain: {
      type: Boolean,
      default: true,
    },
    subCategories: [
      {
        type: ObjectId,
        ref: 'Category',
      },
    ],
    addedBy: {
      type: ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true },
);

const CategoryModel = mongoose.model('Category', categorySchema);
export default CategoryModel;
