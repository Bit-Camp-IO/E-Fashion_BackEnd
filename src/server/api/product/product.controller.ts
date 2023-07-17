// import Product from '@/core/product';
import {NotFoundError} from '@/core/errors';
import {ProductOptions, getProductForUser, getProductsList, productsInfo} from '@/core/product';
import {Controller} from '@server/decorator';
import RequestError from '@server/utils/errors';
// import {wrappResponse} from '@server/utils/response';
import {HttpStatus} from '@server/utils/status';
import {Request, RequestHandler, Response} from 'express';

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
}

export default new ProductController();
