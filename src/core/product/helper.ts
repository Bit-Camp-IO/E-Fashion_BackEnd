import ProductModel, { ProductDB } from '@/database/models/product';
import type * as T from './interfaces';
import { AppError } from '../errors';
import { ReviewDB } from '@/database/models/review';

export async function _getProduct(id: string): Promise<ProductDB> {
  const product = await ProductModel.findById(id);
  if (!product) throw AppError.notFound('Product with id ' + id + ' not found.');
  return product;
}

export function _formatProduct(pDoc: ProductDB): T.ProductResponse {
  return {
    id: pDoc._id.toString(),
    title: pDoc.title,
    description: pDoc.description,
    price: pDoc.price - (pDoc.discount || 0 * pDoc.price),
    available: pDoc.available,
    brand: pDoc.brandName || '',
    discount: pDoc.discount || 0,
    imagesUrl: pDoc.imagesURL,
    isNew: pDoc.is_new,
    oldPrice: pDoc.price,
    rate: pDoc.rate || 0,
    colors: pDoc.colors || [],
    sizes: pDoc.sizes || [],
    gender: pDoc.gender,
    stock: pDoc.stock || 0,
  };
}

export function _formatItemProductList(pDoc: ProductDB): T.ProductItemApi {
  return {
    id: pDoc._id.toString(),
    title: pDoc.title,
    price: pDoc.price - (pDoc.discount || 0 * pDoc.price),
    discount: pDoc.discount || 0,
    imageUrl: pDoc.imagesURL[0],
    oldPrice: pDoc.price,
  };
}

export function _sortProduct(q: any, options?: T.ProductSortOptions) {
  if (!options) return;
  if (options.price) q.sort({ price: options.price });
  if (options.newness) q.sort({ createdAt: options.newness });
  if (options.popularity) q.sort({ rate: options.popularity });
}

export function _filterProduct(options?: T.ProductFilterOptions) {
  const filter: any = {};
  if (!options) return filter;
  if (options.maxPrice) filter.price = { $lte: options.maxPrice };
  if (options.minPrice) filter.price = { ...filter.price, $gte: options.minPrice };
  if (options.category && options.category.length > 0) {
    filter.category = { $in: options.category };
  }
  if (options.gender) filter.gender = options.gender;
  if (options.search) {
    filter.$or = [{ title: { $regex: options.search, $options: 'i' } }];
  }
  if (options.brands && options.brands.length > 0) {
    filter.brand = { $in: options.brands };
  }
  if (options.discount) {
    filter.discount = { $gte: 1 };
  }
  return filter;
}

export function _calculateProductRate(reviews: ReviewDB[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((total, review) => total + review.rate, 0) / reviews.length;
}

export function _formatReviewList(reviews: ReviewDB[]): T.ReviewsResponse {
  const rateCount: T.RateCountResponse = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    total: reviews.length,
  };
  const reviewsResponse: T.ReviewUserResponse[] = [];
  reviews.forEach(r => {
    rateCount[Math.floor(r.rate) as keyof T.RateCountResponse] += 1;
    const user = r.user._id
      ? {
          id: r.user._id.toString() as string,
          fullName: r.user.fullName as string,
          profileImage: r.user.profileImage as string,
        }
      : { id: '0', fullName: 'Deleted User' };
    reviewsResponse.push({
      id: r._id,
      rate: r.rate,
      comment: r.comment || '',
      user: user,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  });
  return {
    average: _calculateProductRate(reviews),
    rateCount,
    reviews: reviewsResponse,
  };
}

export function _formatReview(r: ReviewDB): T.ReviewUserResponse {
  const user = r.user._id
    ? {
        id: r.user._id.toString() as string,
        fullName: r.user.fullName as string,
        profileImage: r.user.profileImage as string,
      }
    : { id: '0', fullName: 'Deleted User' };
  return {
    id: r._id,
    rate: r.rate,
    comment: r.comment || '',
    user: user,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}
