import ProductModel, { ProductDB } from '@/database/models/product';
import { AsyncSafeResult } from '@type/common';
import { InvalidDataError, NotFoundError } from '../errors';
import {
  CreateProductReturn,
  ProductApi,
  ProductData,
  ProductFilterOptions,
  ProductItemApi,
  ProductItemsApiList,
  ProductOptions,
  ProductReviewData,
  ProductSortOptions,
  ProductsInfo,
} from './interfaces';
import { removeFile } from '../utils';
import Config from '@/config';
import { join } from 'path';
import ReviewModel, { ReviewDB } from '@/database/models/review';
import { UserDB } from '@/database/models/user';
import BrandModel from '@/database/models/brand';
import CategoryModel from '@/database/models/categorie';
//import ReviewModel, { ReviewDB } from '@/database/models/review';
export * from './interfaces';

type ProductCreationData = Omit<ProductData, 'categoryId' | 'brandId' | 'imagesUrl'> & {
  imagesURL: string[];
  addedBy: string;
  category?: string;
  brand?: string;
  brandName?: string;
};
export async function createProduct(data: ProductData, adminId: string): CreateProductReturn {
  try {
    const productModelData: ProductCreationData = {
      ...data,
      imagesURL: data.imagesUrl,
      addedBy: adminId,
    };
    if (data.brandId) {
      const brand = await BrandModel.findById(data.brandId);
      if (!brand) throw new InvalidDataError('Invalid Brand id ' + data.brandId);
      productModelData.brand = brand._id.toString();
      productModelData.brandName = brand.name;
    }
    if (data.categoryId) {
      const category = await CategoryModel.findById(data.categoryId);
      if (!category) throw new InvalidDataError('Invalid Brand id ' + data.categoryId);
      productModelData.category = category._id;
    }
    const product = await ProductModel.create(productModelData);
    const result: ProductApi = _formatProduct(product);
    return { result, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

async function _getProduct(id: string) {
  const product = await ProductModel.findById(id);
  if (!product) throw new NotFoundError('Product with id ' + id);
  return product;
}

export async function getProductForAdmin(id: string): AsyncSafeResult<unknown> {
  try {
    const product = (await _getProduct(id)).toObject();
    const productResult = {
      ...product,
      id: product._id.toString(),
    };
    return { result: productResult, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getProductForUser(id: string): AsyncSafeResult<ProductApi> {
  try {
    const product = await _getProduct(id);
    const result: ProductApi = _formatProduct(product);
    return { result, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getProductsList(
  options: ProductOptions,
): AsyncSafeResult<ProductItemsApiList> {
  try {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skipDocsNumber = (page - 1) * limit;
    const productsQuery = ProductModel.find(_filter(options.filter));
    _sort(productsQuery, options.sort);
    const products = await productsQuery.skip(skipDocsNumber).limit(limit).exec();
    const count = await ProductModel.count(_filter(options.filter));
    const result: ProductItemsApiList = {
      products: products.map(p => _formatItemProductList(p)),
      count: products.length,
      page: page,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    };
    return { result, error: null };
  } catch (error) {
    return { result: null, error };
  }
}

export async function updateProduct(
  id: string,
  productData: Partial<ProductData>,
): AsyncSafeResult<ProductData> {
  try {
    const product = await ProductModel.findByIdAndUpdate(id, { $set: productData }, { new: true });
    if (!product) throw new NotFoundError('Product with' + id);
    return { result: _formatProduct(product), error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function removeProduct(id: string): Promise<Error | null> {
  try {
    const product = await ProductModel.findById(id);
    if (!product) return new NotFoundError('Product with ' + id);
    for (const image of product.imagesURL) {
      await removeFile(join(Config.ProductImagesDir, image));
    }
    await ProductModel.findByIdAndRemove(id);
    return null;
  } catch (err) {
    return err;
  }
}

export async function productsInfo(): AsyncSafeResult<ProductsInfo> {
  try {
    const productsInfo = await ProductModel.aggregate([
      { $unwind: { path: '$sizes', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$colors', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
          sizes: { $addToSet: '$sizes' },
          colors: { $addToSet: { name: '$colors.name', hex: '$colors.hex' } },
        },
      },
      { $project: { _id: 0 } },
    ]);
    const info = productsInfo[0];
    return { result: info, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

//TODO: Check response type
export async function addReviewToProduct(reviewData: ProductReviewData): AsyncSafeResult<any> {
  try {
    const existingReview = await ReviewModel.findOne({
      user: reviewData.userId,
      product: reviewData.productId,
    });
    if (existingReview) {
      throw new Error('You have already reviewed this product.');
    }

    const review = await ReviewModel.create({
      user: reviewData.userId,
      product: reviewData.productId,
      rate: reviewData.rate,
      comment: reviewData.comment,
    });

    const productReviews = await ReviewModel.find({ product: reviewData.productId });
    const rate = _calculateProductRate(productReviews, reviewData.rate);

    await ProductModel.findByIdAndUpdate(
      reviewData.productId,
      { $addToSet: { reviews: review }, $set: { rate: rate } },
      { new: true },
    );
    return { result: review, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function removeReview(reviewId: string, userId: string): Promise<Error | null> {
  try {
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundError('Review with id ' + reviewId);
    }

    const productId = review.product;
    const product = await ProductModel.findById(productId);

    if (!product) {
      throw new NotFoundError('Product with id ' + productId);
    }

    await ProductModel.findByIdAndUpdate(productId, { $pull: { reviews: reviewId } });

    await ReviewModel.findOneAndRemove({ _id: reviewId, user: userId });

    const remainingReviews = await ReviewModel.find({ product: productId });
    const rate = _calculateProductRate(remainingReviews, 0);

    await ProductModel.findByIdAndUpdate(productId, { $set: { rate: rate } });
    return null;
  } catch (err) {
    return err;
  }
}

//TODO: Handle Review obejct as Response
export async function listReviews(productId: string): AsyncSafeResult<any> {
  try {
    const reviews = await ReviewModel.find({ product: productId }).populate<{ user: UserDB }>(
      'user',
    );
    if (!reviews) throw new NotFoundError('Product with id ' + productId);
    const result = reviews.map(review => ({
      user: review.user.fullName,
      rate: review.rate,
      comment: review.comment,
    }));
    return { result: result, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function addDiscount(
  productId: string,
  discount: number,
): AsyncSafeResult<ProductApi> {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      {
        $set: {
          discount: discount,
        },
      },
      { new: true },
    );
    if (!product) throw new NotFoundError('Product with id ' + productId);
    return { result: _formatProduct(product), error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function removeDiscount(productId: string): Promise<Error | null> {
  try {
    const product = await ProductModel.findByIdAndUpdate(productId, {
      $unset: { discount: 0 },
    });
    if (!product) throw new NotFoundError('Product with id ' + productId);
    return null;
  } catch (err) {
    return err;
  }
}

function _calculateProductRate(reviews: ReviewDB[], newRating: number): number {
  const totalRatings = reviews.reduce((total, review) => total + review.rate, 0);
  const newTotalRatings = totalRatings + newRating;
  return newTotalRatings / (reviews.length + 1);
}

function _formatItemProductList(pDoc: ProductDB): ProductItemApi {
  return {
    id: pDoc._id.toString(),
    title: pDoc.title,
    price: pDoc.price - (pDoc.discount || 0 * pDoc.price),
    discount: pDoc.discount || 0,
    imageUrl: pDoc.imagesURL[0],
    oldPrice: pDoc.price,
  };
}

function _formatProduct(pDoc: ProductDB): ProductApi {
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
  };
}

function _sort(q: any, options?: ProductSortOptions) {
  if (!options) return;
  if (options.price) q.sort({ price: options.price });
  if (options.newness) q.sort({ createdAt: options.newness });
  if (options.popularity) q.sort({ rate: options.popularity });
}

function _filter(options?: ProductFilterOptions) {
  const filter: any = {};
  if (!options) return filter;
  if (options.maxPrice) filter.price = { $lte: options.maxPrice };
  if (options.minPrice) filter.price = { ...filter.price, $gte: options.minPrice };
  if (options.category && options.category.length > 0) {
    filter.category = { $in: options.category };
  }
  if (options.search) {
    filter.$or = [{ $text: { $search: options.search } }];
  }
  if (options.brands && options.brands.length > 0) {
    filter.brand = { $in: options.brands };
  }
  if (options.discount) {
    filter.discount = { $gte: 1 };
  }
  return filter;
}
