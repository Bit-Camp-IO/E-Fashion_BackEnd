import mongoose from 'mongoose';
import { AdminDB } from './admin';
import { Relation, RelationList } from '@type/database';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

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
