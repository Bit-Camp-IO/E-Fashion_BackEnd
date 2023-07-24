import { AsyncSafeResult } from '@type/common';

export interface ProductItemApi {
  id: string;
  title: string;
  oldPrice: number;
  price: number;
  discount: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  imagesUrl: string[];
  isNew: boolean;
  available: boolean;
  rate: number;
  brand: string;
  description: string;
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
  colors: { name: string; hex: string }[];
  sizes: string[];
  imagesUrl: string[];
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
  categories?: string[];
  brands?: string[];
  brandsName?: string[];
  search?: string;
}

export interface ProductsInfo {
  maxPrice: number;
  minPrice: number;
}
