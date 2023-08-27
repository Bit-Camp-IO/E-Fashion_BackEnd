import { AsyncSafeResult } from '@type/common';

export interface ProductItemApi {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  oldPrice: number;
  discount: number;
}

export interface ProductApi extends Omit<ProductItemApi, 'imageUrl'> {
  colors: { name: string; hex: string }[];
  sizes: string[];
  imagesUrl: string[];
  isNew: boolean;
  available: boolean;
  rate: number;
  brand: string;
  description: string;
  gender: number;
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
  gender: number;
}

// export interface ProductResult {
//   title: string;
//   description: string;
//   price: number;
//   colors: { name: string; hex: string }[];
//   sizes: string[];
//   id: string;
// }

export type CreateProductReturn = AsyncSafeResult<ProductApi>;

export interface ProductOptions {
  page: number;
  limit: number;
  sort: ProductSortOptions;
  filter: ProductFilterOptions;
}

export type Sort = 1 | -1;

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
  search?: string;
  gender?: number;
  discount?: boolean;
}

export interface ProductsInfo {
  maxPrice: number;
  minPrice: number;
  colors: { hex: string; name: string }[];
  sizes: string[];
}

export interface ProductReviewData {
  userId: string;
  productId: string;
  rate: number;
  comment: string;
}
