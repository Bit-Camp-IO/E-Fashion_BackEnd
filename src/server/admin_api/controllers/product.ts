import {Admin} from '@/core/admin/admin';
import {ProductData} from '@/core/product';
import {Controller, Validate, Guard} from '@server/decorator';
import {Request, Response} from 'express';
import {CreateProductSchema, createProductSchema} from '../valid';
import RequestError from '@server/utils/errors';
import {HttpStatus} from '@server/utils/status';
import {wrappResponse} from '@server/utils/response';
import {AdminRole} from '@/core/admin';
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
    res.status(HttpStatus.Created).json(wrappResponse(product.result, HttpStatus.Created));
  }
}
export default new ProductController();
