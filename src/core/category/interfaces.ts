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
