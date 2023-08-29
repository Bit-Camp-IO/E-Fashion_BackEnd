import { Gender } from '../gender';

export interface CategoryData {
  name: string;
  description: string;
  image: string;
  gender: Gender;
}

export interface CategoryResult {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  gender: Gender;
}
