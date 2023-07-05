import mongoose, { Schema } from 'mongoose';
import { AdminDB } from './admin';
import { ObjectId, Relation, RelationList } from '@type/database';

export interface CategorieDB {
  name: string;
  description?: string;
  imagesURL: string[];
  isMain: boolean;
  subCategories: RelationList<CategorieDB>;
  addedBy: Relation<AdminDB>;
}

const categorySchema = new Schema<CategorieDB>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    imagesURL: {
      type: [String],
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

module.exports = mongoose.model('Category', categorySchema);
