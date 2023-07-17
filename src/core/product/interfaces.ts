import {AsyncSafeResult} from '@type/common';

export interface ProductItemApi {
  id: string;
  title: string;
  description: string;
  oldPrice: number;
  price: number;
  discount: number;
  colors: {name: string; hex: string}[];
  sizes: string[];
  imagesUrl: string[];
  brand: string;
  isNew: boolean;
  rate: number;
  available: boolean;
}

export interface ProductItemsApiList {
  products: ProductItemApi[];
  page: number;
  count: number;
  totalItems: number;
  totalPages: number;
}

export interface ProductData {
  title: string;
  description: string;
  price: number;
  colors: {name: string; hex: string}[];
  sizes: string[];
}

export interface ProductResult {
  title: string;
  description: string;
  price: number;
  colors: {name: string; hex: string}[];
  sizes: string[];
  id: string;
}
export type CreateProductReturn = AsyncSafeResult<ProductResult>;

export interface ProductOptions {
  page: number;
  limit: number;
  sort: ProductSortOptions;
  filter: ProductFilterOptions;
}

type Sort = 'asc' | 'desc';

export interface ProductSortOptions {
  price?: Sort;
  popularity?: Sort;
  newness?: Sort;
}

export interface ProductFilterOptions {
  maxPrice?: number;
  minPrice?: number;
}

export interface ProductsInfo {
  maxPrice: number;
  minPrice: number;
}
