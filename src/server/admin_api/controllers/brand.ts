import { AdminRole } from '@/core/admin';
import { Controller, Guard, Validate } from '@server/decorator';
import { CreateBrandSchema, createBrandSchema, updateBrandSchema } from '../valid';
import { Request, Response } from 'express';
import { Admin } from '@/core/admin/admin';
import { BrandData } from '@/core/brand/interfaces';
import RequestError, { handleResultError, unwrapResult } from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { validateId } from '@/core/utils';

@Controller()
class BrandController {
  @Validate(createBrandSchema)
  @Guard(AdminRole.ADMIN)
  public async create(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const body: CreateBrandSchema = req.body;
    const brandData: BrandData = {
      name: body.name,
      description: body.description,
      link: body.link,
      logo: body.logo || '',
    };
    const brand = await admin.addBrand(brandData);
    const result = unwrapResult(brand);
    res.JSON(HttpStatus.Created, result);
  }

  @Validate(updateBrandSchema)
  @Guard(AdminRole.ADMIN)
  async editBrand(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const { id } = req.params;
    const body: Partial<BrandData> = req.body;
    const productData: Partial<BrandData> = {
      name: body.name,
      description: body.description,
      link: body.link,
    };
    const brand = await admin.editBrand(productData, id);
    const result = unwrapResult(brand);
    res.JSON(HttpStatus.Ok, result);
  }

  @Guard(AdminRole.ADMIN)
  async remove(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const { id } = req.params;
    const error = await admin.removeBrand(id);
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
    const brand = await admin.addProductsToBrand(req.params['id']!, ids);
    const result = unwrapResult(brand);
    res.JSON(HttpStatus.Ok, result);
  }

  @Guard(AdminRole.ADMIN)
  async removeProducts(req: Request, res: Response) {
    const admin = req.admin as Admin;
    const ids = req.body['productsId'];
    for (const id of ids) {
      if (!validateId) throw new RequestError('Invalid id' + id, HttpStatus.BadRequest);
    }
    const error = await admin.removeProductsFromBrand(req.params['id']!, ids);
    if (error) {
      handleResultError(error);
    }
    res.JSON(HttpStatus.Ok);
  }
}

export default new BrandController();
