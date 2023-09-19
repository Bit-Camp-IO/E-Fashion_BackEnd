export type ProductCreationData = Omit<ProductData, 'categoryId' | 'brandId' | 'imagesUrl'> & {
  imagesURL: string[];
  addedBy: string;
  category?: string;
  brand?: string;
  brandName?: string;
};

export interface ProductItemApi {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  oldPrice: number;
  discount: number;
}

export interface ProductResponse extends Omit<ProductItemApi, 'imageUrl'> {
  colors: { name: string; hex: string }[];
  sizes: string[];
  imagesUrl: string[];
  isNew: boolean;
  available: boolean;
  rate: number;
  brand: string;
  description: string;
  gender: number;
  stock: number;
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
  categoryId?: string;
  brandId?: string;
}

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
  category?: string[];
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

export interface RateCountResponse {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  total: number;
}
export interface ReviewUserResponse {
  id: string;
  user: {
    id: string;
    fullName: string;
    profileImage?: string;
  };
  comment?: string;
  rate: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface ReviewsResponse {
  average: number;
  rateCount: RateCountResponse;
  reviews: ReviewUserResponse[];
}
