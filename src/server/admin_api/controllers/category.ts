import { AdminRole } from '@/core/admin';
import { Controller, Guard, Validate } from '@server/decorator';
import { CreateCategorySchema, createCategorySchema, updateCategorySchema } from '../valid';
import { Request, Response } from 'express';
import { Admin } from '@/core/admin/admin';
import { CategoryData } from '@/core/category/interfaces';
import RequestError, { handleResultError, unwrapResult } from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { validateId } from '@/core/utils';

@Controller()
class CategoryController {
  @Validate(createCategorySchema)
  @Guard(AdminRole.ADMIN)
  public async create(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const body: CreateCategorySchema = req.body;
    const category = await admin.addCategory(body);
    // if (category.error) {
    //   if (category.error instanceof DuplicateError)
    //     throw new RequestError(category.error.message, HttpStatus.BadRequest);
    //   throw RequestError._500();
    // }
    const result = unwrapResult(category);
    res.JSON(HttpStatus.Created, result);
  }

  @Validate(updateCategorySchema)
  @Guard(AdminRole.ADMIN)
  async editCategory(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const { id } = req.params;
    const body: Partial<CategoryData> = req.body;
    const productData: Partial<CategoryData> = {
      name: body.name,
      description: body.description,
      image: body.image,
      gender: body.gender,
    };
    const product = await admin.editCategory(productData, id);
    // if (product.error) {
    //   throw RequestError._500();
    // }
    const result = unwrapResult(product);
    res.JSON(HttpStatus.Ok, result);
  }

  @Guard(AdminRole.ADMIN)
  async remove(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const { id } = req.params;
    const error = await admin.removeCategory(id);
    // if (error) {
    //   if (error instanceof NotFoundError)
    //     throw new RequestError(error.message, HttpStatus.NotFound);
    //   throw RequestError._500();
    // }
    if (error) {
      handleResultError(error);
    }
    res.JSON(HttpStatus.Ok);
  }
  @Guard(AdminRole.ADMIN)
  async addProducts(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const ids = req.body['productsId'];
    for (const id of ids) {
      if (!validateId) throw new RequestError('Invalid id' + id, HttpStatus.BadRequest);
    }
    const cat = await admin.addProductsToCategory(req.params['id']!, ids);
    // if (cat.error) {
    //   if (cat.error instanceof NotFoundError)
    //     throw new RequestError(cat.error.message, HttpStatus.BadRequest);
    //   throw RequestError._500();
    // }
    const result = unwrapResult(cat);
    res.JSON(HttpStatus.Accepted, result);
  }

  @Guard(AdminRole.ADMIN)
  async removeProducts(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const ids = req.body['productsId'];
    for (const id of ids) {
      if (!validateId) throw new RequestError('Invalid id' + id, HttpStatus.BadRequest);
    }
    const error = await admin.removeProductsFromCategory(req.params['id']!, ids);
    // if (error) {
    //   throw RequestError._500();
    // }
    if (error) {
      handleResultError(error);
    }
    res.JSON(HttpStatus.Ok);
  }
}

export default new CategoryController();
