import { getAllBrands } from '@/core/brand';
import { Controller } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';

@Controller()
class CategoryController {
  public async getList(_req: Request, res: Response) {
    const category = await getAllBrands();
    if (category.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, category.result);
  }
}

export default new CategoryController();
