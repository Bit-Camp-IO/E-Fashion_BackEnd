// import Product from '@/core/product';
import { NotFoundError } from '@/core/errors';
import {
  ProductOptions,
  ProductReviewData,
  Sort,
  addReviewToProduct,
  getProductForUser,
  getProductsList,
  listReviews,
  productsInfo,
  removeReview,
} from '@/core/product';
import { validateId } from '@/core/utils';
import { Controller, Validate } from '@server/decorator';
import RequestError from '@server/utils/errors';
// import {wrappResponse} from '@server/utils/response';
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

function queryToSort(q?: any): Sort | null {
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
    const options: ProductOptions = {
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
    if (_categories && _categories.length > 0) options.filter.categories = _categories;
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

    const products = await getProductsList(options);
    if (products.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, products.result);
    // const products = await Product.getAll();
    // res.status(HttpStatus.Ok).json(wrappResponse(products, HttpStatus.Ok));
  }

  async getOne(req: Request, res: Response) {
    // TODO: Implement the logic to retrieve a specific product
    const productId = req.params.id;
    const product = await getProductForUser(productId);
    if (product.error) {
      if (product.error instanceof NotFoundError) {
        throw new RequestError(product.error.message, HttpStatus.NotFound);
      }
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, product.result);
  }

  async listInfo(_: Request, res: Response) {
    const info = await productsInfo();
    if (info.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, info.result);
  }

  @Validate(reviewSchema)
  async addReview(req: Request, res: Response) {
    const productId = req.params.id;
    if (!validateId(productId)) throw new RequestError('invalid product id');
    const body: ReviewSchema = req.body;
    const review: ProductReviewData = {
      userId: req.userId!,
      productId: productId,
      rate: body.rate,
      comment: body.comment,
    };
    const product = await addReviewToProduct(review);
    if (!product) throw RequestError._500();
    res.sendStatus(HttpStatus.NoContent);
  }

  async removeReview(req: Request, res: Response) {
    const { reviewId } = req.body;
    if (!validateId(reviewId)) throw new RequestError('invalid review id');
    const error = await removeReview(reviewId, req.userId!);
    if (error) throw new RequestError(error.message, HttpStatus.BadRequest);
    res.sendStatus(HttpStatus.Accepted);
  }

  async listReviews(req: Request, res: Response) {
    const productId = req.params.id;
    if (!validateId(productId)) throw new RequestError('invalid product id');
    const reviews = await listReviews(productId);
    if (reviews.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, reviews.result);
  }
}

export default new ProductController();
