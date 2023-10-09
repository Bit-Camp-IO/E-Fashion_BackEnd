import { NotFoundError } from '@/core/errors';
import * as ProductServices from '@/core/product';
import { validateId } from '@/core/utils';
import { Controller, Validate } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, RequestHandler, Response } from 'express';
import { ReviewSchema, reviewSchema } from './product.valid';

interface ProductHandler {
  getList: RequestHandler;
  getOne: RequestHandler;
}

function queryToNumber(q?: any): number | null {
  if (!q) return null;
  const num = Number(q);
  if (isNaN(num)) return null;
  return num;
}
function queryToListId(q?: any): string[] | null {
  if (!q) return null;
  const list = q.split(',');
  const listId = [];
  for (const b of list) {
    validateId(b) && listId.push(b);
  }
  return listId;
}

function queryToSort(q?: any): ProductServices.Sort | null {
  if (!q) return null;
  q = (q.toString() as string).toLowerCase();
  if (q === 'asc' || q === '1') {
    return 1;
  } else if (q === 'desc' || q === '-1') {
    return -1;
  } else {
    return null;
  }
}

@Controller()
class ProductController implements ProductHandler {
  public async getList(req: Request, res: Response) {
    const limit = req.query['limit'] ? Number(req.query['limit']) : 20;
    const page = req.query['page'] ? Number(req.query['page']) : 1;
    const options: ProductServices.ProductOptions = {
      limit,
      page,
      filter: {},
      sort: {},
    };
    const _maxPrice = queryToNumber(req.query['max-price']);
    if (_maxPrice) options.filter.maxPrice = _maxPrice;
    const _minPrice = queryToNumber(req.query['min-price']);
    if (_minPrice) options.filter.minPrice = _minPrice;
    const _gender = queryToNumber(req.query['gender']);
    if (_gender) options.filter.gender = _gender;
    const _categories = queryToListId(req.query['categories']);
    if (_categories && _categories.length > 0) options.filter.category = _categories;
    const _brands = queryToListId(req.query['brands']);
    if (_brands && _brands.length > 0) options.filter.brands = _brands;
    options.filter.discount =
      req.query['discount']?.toString().toLowerCase() === 'true' ? true : false;
    const _search = req.query['search'] as string;
    if (_search) options.filter.search = _search;

    const _sortWithPrice = queryToSort(req.query['sort-price']);
    if (_sortWithPrice) options.sort.price = _sortWithPrice;
    const _sortWithNew = queryToSort(req.query['sort-new']);
    if (_sortWithNew) options.sort.newness = _sortWithNew;
    const _sortWithRate = queryToSort(req.query['sort-popularity']);
    if (_sortWithRate) options.sort.popularity = _sortWithRate;

    const products = await ProductServices.getProductsList(options);
    if (products.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, products.result);
  }

  async getOne(req: Request, res: Response) {
    const productId = req.params.id;
    const product = await ProductServices.getProductForUser(productId);
    if (product.error) {
      if (product.error instanceof NotFoundError) {
        throw new RequestError(product.error.message, HttpStatus.NotFound);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, product.result);
  }

  async listInfo(_: Request, res: Response) {
    const info = await ProductServices.productsInfo();
    if (info.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, info.result);
  }

  @Validate(reviewSchema)
  async addReview(req: Request, res: Response) {
    const productId = req.params.id;
    if (!validateId(productId)) throw new RequestError('invalid product id', HttpStatus.BadRequest);
    const body: ReviewSchema = req.body;
    const reviewData: ProductServices.ProductReviewData = {
      userId: req.userId!,
      productId: productId,
      rate: body.rate,
      comment: body.comment,
    };
    const review = await ProductServices.addReviewToProduct(reviewData);
    if (review.error) {
      if (review.error instanceof NotFoundError) {
        throw new RequestError(review.error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, review.result);
  }

  async removeReview(req: Request, res: Response) {
    const reviewId = req.params['id'];
    if (!validateId(reviewId)) throw new RequestError('invalid review id', HttpStatus.BadRequest);
    const error = await ProductServices.removeReview(reviewId, req.userId!);
    if (error) {
      if (error instanceof NotFoundError) {
        throw new RequestError(error.message, HttpStatus.BadRequest);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok);
  }

  async listReviews(req: Request, res: Response) {
    const productId = req.params.id;
    if (!validateId(productId)) throw new RequestError('invalid product id', HttpStatus.BadRequest);
    const reviews = await ProductServices.listReviews(productId);
    if (reviews.error) {
      if (reviews.error instanceof NotFoundError) {
        throw new RequestError(reviews.error.message, HttpStatus.NotFound);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, reviews.result);
  }

  async myRate(req: Request, res: Response) {
    const productId = req.params.id;
    if (!validateId(productId)) throw new RequestError('invalid product id', HttpStatus.BadRequest);
    const review = await ProductServices.userRateOnProduct(req.userId!, productId);
    if (review.error) {
      if (review.error instanceof NotFoundError) {
        throw new RequestError(review.error.message, HttpStatus.NotFound);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, review.result);
  }
}

export default new ProductController();
