import { Gender } from '../gender';

export interface CategoryData {
  name: string;
  description: string;
  image: string;
  gender: Gender;
  // isMain?: boolean;
  // subCategories?: string[];
}

export interface CategoryResult {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  // subCategories: CategoryResult[];
  gender: Gender;
}
