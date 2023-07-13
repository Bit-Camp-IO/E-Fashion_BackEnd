import {Admin} from '@/core/admin/admin';
import {ProductData} from '@/core/product';
import {Controller, Validate, Guard} from '@server/decorator';
import {Request, Response} from 'express';
import {CreateProductSchema, createProductSchema} from '../valid';
import RequestError from '@server/utils/errors';
import {HttpStatus} from '@server/utils/status';
import {AdminRole} from '@/core/admin';
import {NotFoundError} from '@/core/errors';
@Controller()
class ProductController {
  @Validate(createProductSchema)
  @Guard(AdminRole.ADMIN)
  async create(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const body: CreateProductSchema = req.body;
    const productData: ProductData = {
      colors: body.colors,
      description: body.description,
      price: body.price,
      sizes: body.sizes,
      title: body.title,
    };
    const product = await admin.addProduct(productData);
    if (product.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, product.result);
  }
  @Guard(AdminRole.ADMIN)
  async remove(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const id = req.params['id'] as string;
    const error = await admin.removeProduct(id);
    console.log(error);
    if (error) {
      if (error instanceof NotFoundError)
        throw new RequestError(error.message, HttpStatus.NotFound);
      throw RequestError._500();
    }
    res.sendStatus(HttpStatus.NoContent);
  }
  @Guard(AdminRole.ADMIN)
  async getAllProductsForAdmin(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const products = await admin.getAllProducts();
    if (products.error) {
      throw RequestError._500(); 
    }
    res.JSON(HttpStatus.Ok, products.result);
  }
}
export default new ProductController();
