import ReviewModel from '@/database/models/review';
import { ProductReviewData, ReviewUserResponse, ReviewsResponse } from './interfaces';
import { AsyncSafeResult } from '../types';
import { UserDB } from '@/database/models/user';
import { AppError } from '../errors';
import * as Helper from './helper';
import ProductModel from '@/database/models/product';

export async function listReviews(productId: string): AsyncSafeResult<ReviewsResponse> {
  try {
    const reviews = await ReviewModel.find({ product: productId }).populate<{ user: UserDB }>(
      'user',
    );
    if (!reviews) throw AppError.notFound('Product with id ' + productId + ' not found.');
    return { result: Helper._formatReviewList(reviews), error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function userRateOnProduct(
  userId: string,
  productId: string,
): AsyncSafeResult<ReviewUserResponse> {
  try {
    const review = await ReviewModel.findOne({
      $and: [{ user: userId }, { product: productId }],
    }).populate('user');
    if (!review) throw AppError.notFound('Rate not found.');
    const result: ReviewUserResponse = Helper._formatReview(review);
    return { result, error: null };
  } catch (error) {
    return { error, result: null };
  }
}

export async function addReviewToProduct(
  reviewData: ProductReviewData,
): AsyncSafeResult<ReviewUserResponse> {
  try {
    const product = await ProductModel.findById(reviewData.productId);
    if (!product) {
      throw AppError.notFound('Product with Id ' + reviewData.productId + ' not found.');
    }
    let review = await ReviewModel.findOne({
      $and: [{ user: reviewData.userId }, { product: reviewData.productId }],
    });
    if (review) {
      review.rate = reviewData.rate;
      review.comment = reviewData.comment;
      review.updatedAt = new Date();
    } else {
      review = new ReviewModel({
        user: reviewData.userId,
        product: reviewData.productId,
        rate: reviewData.rate,
        comment: reviewData.comment,
      });
    }
    await review.save();
    await review.populate('user');
    const productReviews = await ReviewModel.find({ product: reviewData.productId });
    const rate = Helper._calculateProductRate(productReviews);

    await ProductModel.findByIdAndUpdate(
      reviewData.productId,
      { $set: { rate: rate } },
      { new: true },
    );
    const userReview: ReviewUserResponse = Helper._formatReview(review);
    return { result: userReview, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function removeReview(reviewId: string, userId: string): Promise<Error | null> {
  try {
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      throw AppError.notFound('Review with id ' + reviewId + ' not found.');
    }

    const productId = review.product;
    const product = await ProductModel.findById(productId);

    if (!product) {
      throw AppError.notFound('Product with id ' + productId + ' not found.');
    }

    await ProductModel.findByIdAndUpdate(productId, { $pull: { reviews: reviewId } });

    await ReviewModel.findOneAndRemove({ _id: reviewId, user: userId });

    const remainingReviews = await ReviewModel.find({ product: productId });
    const rate = Helper._calculateProductRate(remainingReviews);

    await ProductModel.findByIdAndUpdate(productId, { $set: { rate: rate } });
    return null;
  } catch (err) {
    return err;
  }
}
