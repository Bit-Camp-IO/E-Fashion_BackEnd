import { getAllCategories, getCategoryForUser } from '@/core/category';
import { Gender, stringToGender } from '@/core/gender';
import { Controller } from '@server/decorator';
import RequestError from '@server/utils/errors';
import { HttpStatus } from '@server/utils/status';
import { Request, Response } from 'express';

@Controller()
class CategoryController {
  public async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const category = await getCategoryForUser(id);
    if (category.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, category.result);
  }

  public async getList(req: Request, res: Response) {
    const genderQ = req.query['gender']?.toString();
    let gender: Gender | undefined = stringToGender(genderQ);

    const category = await getAllCategories(gender);
    if (category.error) {
      throw RequestError._500();
    }
    res.JSON(HttpStatus.Ok, category.result);
  }
}

export default new CategoryController();
