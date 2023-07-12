// import Product from '@/core/product';
import {NotFoundError} from '@/core/errors';
import {getProductForUser, getProductsList} from '@/core/product';
import {Controller} from '@server/decorator';
import RequestError from '@server/utils/errors';
// import {wrappResponse} from '@server/utils/response';
import {HttpStatus} from '@server/utils/status';
import {Request, RequestHandler, Response} from 'express';

interface ProductHandler {
  getList: RequestHandler;
  getOne: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
}

@Controller()
class ProductController implements ProductHandler {
  public async getList(_: Request, res: Response) {
    const products = await getProductsList();
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

  update(req: Request, res: Response) {
    // TODO: Implement the logic to update an existing product
    const productId = req.params.id;
    res.status(HttpStatus.Ok).json({message: `Updated product ${productId}`});
  }

  delete(req: Request, res: Response) {
    // TODO: Implement the logic to delete a product
    const productId = req.params.id;
    res.status(HttpStatus.Ok).json({message: `Deleted product ${productId}`});
  }
}

export default new ProductController();
