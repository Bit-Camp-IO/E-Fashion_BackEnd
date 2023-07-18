import { AdminRole } from '@/core/admin';
import { Controller, Guard, Validate } from '@server/decorator';
import { CreateCategorySchema, createCategorySchema, updateCategorySchema } from '../valid';
import { Request, Response } from 'express';
import { Admin } from '@/core/admin/admin';
import { CategoryData } from '@/core/category/interfaces';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { DuplicateError, NotFoundError } from '@/core/errors';

@Controller()
class CategoryController {
  @Validate(createCategorySchema)
  @Guard(AdminRole.ADMIN)
  public async create(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const body: CreateCategorySchema = req.body;
    const categoryData: CategoryData = {
      name: body.name,
      description: body.description,
    };
    const category = await admin.addCategory(categoryData);
    if (category.error) {
      if (category.error instanceof DuplicateError)
        throw new RequestError(category.error.message, HttpStatus.BadRequest);
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, category.result);
  }

  @Validate(createCategorySchema)
  @Guard(AdminRole.ADMIN)
  public async createSub(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const { id } = req.params;
    const body: CreateCategorySchema = req.body;
    const categoryData: CategoryData = {
      name: body.name,
      description: body.description,
    };
    const category = await admin.addSubCategory(categoryData, id);
    if (category.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Created, category.result);
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
    };
    const product = await admin.editCategory(productData, id);
    if (product.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, product.result);
  }

  @Guard(AdminRole.ADMIN)
  async remove(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const { id } = req.params;
    const error = await admin.removeCategory(id);
    if (error) {
      if (error instanceof NotFoundError)
        throw new RequestError(error.message, HttpStatus.NotFound);
      throw RequestError._500();
    }
    res.sendStatus(HttpStatus.NoContent);
  }
}

export default new CategoryController();
