import { AsyncSafeResult } from '@type/common';

export interface ProductItemApi {
  id: string;
  title: string;
  description: string;
  oldPrice: number;
  price: number;
  discount: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  imagesUrl: string[];
  brand: string;
  isNew: boolean;
  rate: number;
  available: boolean;
}

export interface ProductData {
  title: string;
  description: string;
  price: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
}

export interface ProductResult {
  title: string;
  description: string;
  price: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  id: string;
}
export type CreateProductReturn = AsyncSafeResult<ProductResult>;
