import { Admin } from '@/core/admin/admin';
import { ProductData } from '@/core/product';
import { Controller, Validate, Guard } from '@server/decorator';
import { Request, Response } from 'express';
import {
  CreateProductSchema,
  UpdateProductSchema,
  createProductSchema,
  productDiscount,
  updateProductSchema,
} from '../valid';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { AdminRole } from '@/core/admin';
import { NotFoundError } from '@/core/errors';
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
      imagesUrl: body.imagesPath,
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
    if (error) {
      if (error instanceof NotFoundError)
        throw new RequestError(error.message, HttpStatus.NotFound);
      throw RequestError._500();
    }
    res.sendStatus(HttpStatus.NoContent);
  }

  @Validate(updateProductSchema)
  @Guard(AdminRole.ADMIN)
  async editProduct(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const { id } = req.params;
    const body: UpdateProductSchema = req.body;
    const productData: UpdateProductSchema = {
      colors: body.colors,
      description: body.description,
      price: body.price,
      sizes: body.sizes,
      title: body.title,
    };
    const product = await admin.editProduct(id, productData);
    if (product.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, product.result);
  }

  @Validate(productDiscount)
  @Guard(AdminRole.ADMIN)
  async addDiscount(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const { id } = req.params;
    const { discount } = req.body;
    const product = await admin.addDiscount(id, discount);
    if (product.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, product.result);
  }

  @Guard(AdminRole.ADMIN)
  async removeDiscount(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const { id } = req.params;
    const error = await admin.removeDiscount(id);
    if (error) {
      if (error instanceof NotFoundError)
        throw new RequestError(error.message, HttpStatus.NotFound);
      throw RequestError._500();
    }
    res.sendStatus(HttpStatus.NoContent);
  }
}
export default new ProductController();
