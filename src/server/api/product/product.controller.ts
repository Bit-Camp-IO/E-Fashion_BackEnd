// import Product from '@/core/product';
import {Controller} from '@server/decorator';
// import {wrappResponse} from '@server/utils/response';
import {HttpStatus} from '@server/utils/status';
import {Request, RequestHandler, Response} from 'express';

interface ProductHandler {
  getAll: RequestHandler;
  getOne: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
}

@Controller()
class ProductController implements ProductHandler {
  public async getAll(_: Request, res: Response) {
    res.send('');
    // const products = await Product.getAll();
    // res.status(HttpStatus.Ok).json(wrappResponse(products, HttpStatus.Ok));
  }

  getOne(req: Request, res: Response) {
    // TODO: Implement the logic to retrieve a specific product
    const productId = req.params.id;
    res.status(HttpStatus.Ok).json({message: `Retrieved product ${productId}`});
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
