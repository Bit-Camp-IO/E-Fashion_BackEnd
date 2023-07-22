import { AdminDB } from '@/database/models/admin';
import { CategorieDB } from '@/database/models/categorie';
import { Relation, RelationList } from '@type/database';
import { Document } from 'mongoose';

export interface CategoryData {
  name: string;
  description: string;
  isMain?: boolean;
  image: string;
  subCategories?: string[];
}

export interface CategoryResult {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  subCategories: CategoryResult[];
}
