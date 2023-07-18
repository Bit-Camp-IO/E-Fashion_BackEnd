import { AdminDB } from '@/database/models/admin';
import { CategorieDB } from '@/database/models/categorie';
import { Relation, RelationList } from '@type/database';
import { Document } from 'mongoose';

export interface CategoryData {
  name: string;
  description: string;
  isMain?: boolean;
  imagesURL?: string[];
  subCategories?: string[];
}

export interface CategoryResult {
  id: string;
  name: string;
  description: string;
  imagesURL: string[];
  subCategories: CategoryResult[];
}

export interface CategoryDoc extends Document, CategorieDB {
  name: string;
  description?: string;
  imagesURL: string[];
  isMain: boolean;
  subCategories: RelationList<CategoryDoc>;
  addedBy: Relation<AdminDB>;
}
