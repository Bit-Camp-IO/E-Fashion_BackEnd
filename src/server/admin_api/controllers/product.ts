import { Admin } from '@/core/admin/admin';
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
import { InvalidDataError, NotFoundError } from '@/core/errors';
@Controller()
class ProductController {
  @Validate(createProductSchema)
  @Guard(AdminRole.ADMIN)
  async create(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const body: CreateProductSchema = req.body;
    const product = await admin.addProduct(body);
    if (product.error) {
      if (product.error instanceof InvalidDataError) {
        throw new RequestError(product.error.message, HttpStatus.BadRequest);
      }
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
    res.JSON(HttpStatus.Ok);
  }

  @Validate(updateProductSchema)
  @Guard(AdminRole.ADMIN)
  async editProduct(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const { id } = req.params;
    const body: UpdateProductSchema = req.body;
    const product = await admin.editProduct(id, body);
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
    res.JSON(HttpStatus.Ok);
  }
}
export default new ProductController();
