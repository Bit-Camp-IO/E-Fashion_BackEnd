// import Product from '@/core/product';
import { NotFoundError } from '@/core/errors';
import { ProductOptions, ProductReviewData, addReviewToProduct, getProductForUser, getProductsList, productsInfo, removeReview } from '@/core/product';
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
    const _categories = queryToListId(req.query['categories']);
    if (_categories && _categories.length > 0) options.filter.categories = _categories;
    const _brands = queryToListId(req.query['brands']);
    if (_brands && _brands.length > 0) options.filter.brands = _brands;
    const _brandsName = queryToListId(req.query['brandsName']);
    if (_brandsName && _brandsName.length > 0) options.filter.brandsName = _brandsName;
    const _search = req.query['search'] as string;
    if (_search) options.filter.search = _search;

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
      comment: body.comment
    }
    const error = await addReviewToProduct(review);
    if (error) throw new RequestError(error.message, HttpStatus.Conflict);
    res.sendStatus(HttpStatus.NoContent);
  }

  async removeReview(req: Request, res: Response) {
    const { reviewId } = req.body;
    if (!validateId(reviewId)) throw new RequestError('invalid review id');
    const error = await removeReview(reviewId, req.userId!);
    if (error) throw new RequestError(error.message, HttpStatus.BadRequest);
    res.sendStatus(HttpStatus.Accepted)
  }
}

export default new ProductController();
